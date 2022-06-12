// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract VDAO is VRFConsumerBaseV2, KeeperCompatibleInterface {
  event VerificationTask(address indexed verifier, uint256 requestId);

  Rental rentalContract;
  address rentalContractAddress;
  address owner;

  //chainlink for rinkeby
  VRFCoordinatorV2Interface COORDINATOR;
  address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
  bytes32 keyHash =
    0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
  uint32 callbackGasLimit = 200000;
  uint16 requestConfirmations = 3;
  uint32 numWords = 1;
  uint64 s_subscriptionId = 6284;
  mapping(uint256 => uint256) chainlinkRequestIdToRequestId;

  //add events

  constructor() VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);

    rentalContractAddress = address(0);
    rentalContract = Rental(rentalContractAddress);
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "not owner");
    _;
  }

  //only admin function to link contract in start only
  function setRentalContractAddress(address _rentalContractAddress)
    external
    onlyOwner
  {
    require(rentalContractAddress == address(0), "contract already set");
    rentalContractAddress = _rentalContractAddress;
  }

  // Add the library methods
  using EnumerableSet for EnumerableSet.AddressSet;

  // Declare a set state variable
  EnumerableSet.AddressSet private activeVerifiers;

  uint256 constant VERIFIER_STAKE = 0.001 ether;
  uint256 constant ANSWER_TIME = 3 minutes;
  uint256 constant VERIFIER_NUMBER = 3;
  uint256 constant PUNISHMENT = 30; //as percent of VERIFIER_STAKE constant value

  //for establishing unique randomness
  uint256 constant RANDOM_PRIME = 325778765244908313467197;
  uint256 constant MOD_OF_RANDOM = 100000000000000000000;

  enum Answer {
    NO_ANSWER,
    NOT_HARMED,
    HARMED
  }

  struct Verifier {
    address verifierAddress;
    Answer answer;
  }

  struct Request {
    string oldImageURI;
    string newImageURI;
    uint256 lastAnswerTime;
    bool isEnded;
    uint256 yesCount;
    uint256 noCount;
    uint256 rewardPool;
    uint256 bicycleId;
    uint256 randomSeed;
    Verifier[] selectedVerifiers;
  }

  mapping(address => ActiveVerifier) public activeVerifierInfo;
  Request[] public requests;
  uint256 punishmentPool;

  struct ActiveVerifier {
    uint256 activeVerificationCount;
    bool activenessRequest;
    uint256 balance;
  }

  function beActiveVerifier() external payable {
    address msgSender = msg.sender; //to reduce gas fees
    require(msg.value == VERIFIER_STAKE, "not enough stake");
    require(activeVerifierInfo[msgSender].balance == 0, "already have balance");
    require(
      EnumerableSet.contains(activeVerifiers, msgSender) == false,
      "already verifier"
    );
    activeVerifierInfo[msgSender].activenessRequest = true;
    EnumerableSet.add(activeVerifiers, msgSender);
    activeVerifierInfo[msgSender].balance = VERIFIER_STAKE;
  }

  function stopRequestingVerifications() external {
    address msgSender = msg.sender;
    require(EnumerableSet.contains(activeVerifiers, msgSender), "not verifier");
    EnumerableSet.remove(activeVerifiers, msgSender);
    activeVerifierInfo[msgSender].activenessRequest = false;
  }

  function checkStopBeingVerifierAndExecute(address verifierAddress) internal {
    ActiveVerifier memory verifier = activeVerifierInfo[verifierAddress];
    if (verifier.activenessRequest == false) {
      if (verifier.balance > 0 && verifier.activeVerificationCount == 0) {
        verifier.balance = 0;
        payable(verifierAddress).send(verifier.balance);
      }
    }
  }

  modifier onlyContract() {
    require(msg.sender == rentalContractAddress, "not rental contract");
    _;
  }

  function addRequest(
    uint256 bicycleId,
    string calldata _oldImageURI,
    string calldata _newImageURI
  ) external payable onlyContract {
    Request storage newRequest = requests.push();
    newRequest.oldImageURI = _oldImageURI;
    newRequest.newImageURI = _newImageURI;
    newRequest.rewardPool = msg.value;
    newRequest.bicycleId = bicycleId;

    uint256 requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );

    chainlinkRequestIdToRequestId[requestId] = requests.length - 1;
  }

  function mockAddRequest(
    string calldata _oldImageURI,
    string calldata _newImageURI
  ) external payable {
    Request storage newRequest = requests.push();
    newRequest.oldImageURI = _oldImageURI;
    newRequest.newImageURI = _newImageURI;
    newRequest.rewardPool = msg.value;
    //newRequest.bicycleId = bicycleId;

    uint256 requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );

    chainlinkRequestIdToRequestId[requestId] = requests.length - 1;
  }

  function getIndex(Verifier[] memory addressArray, address addressToSearch)
    internal
    pure
    returns (uint256)
  {
    for (uint256 i = 0; i < addressArray.length; i++) {
      if (addressArray[i].verifierAddress == addressToSearch) {
        return i;
      }
    }
    require(false, "not verifier in that request");
  }

  //true if not harmed false if it is harmed
  function giveAnswer(uint256 requestId, bool answer) external {
    require(
      requests[requestId].lastAnswerTime <= block.timestamp &&
        requests[requestId].lastAnswerTime != 0,
      "time has not come yet"
    );
    address msgSender = msg.sender;
    uint256 index = getIndex(requests[requestId].selectedVerifiers, msgSender);
    if (answer == true) {
      ++requests[requestId].yesCount;
      requests[requestId].selectedVerifiers[index].answer = Answer.NOT_HARMED;
    } else {
      ++requests[requestId].noCount;
      requests[requestId].selectedVerifiers[index].answer = Answer.HARMED;
    }
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
    internal
    override
  {
    uint256 VDAORequestId = chainlinkRequestIdToRequestId[requestId];
    requests[VDAORequestId].randomSeed = randomWords[0] % MOD_OF_RANDOM;
  }

  function selectVerifiers(uint256 randomSeed, uint256 index) internal {
    uint256 setLength = EnumerableSet.length(activeVerifiers);

    for (uint256 i = 0; i < VERIFIER_NUMBER; i++) {
      uint256 randomIndex = (i * RANDOM_PRIME + randomSeed) % setLength;
      address addedVerifierAddress = EnumerableSet.at(
        activeVerifiers,
        randomIndex
      );
      Verifier storage verifier = requests[index].selectedVerifiers.push();
      verifier.verifierAddress = addedVerifierAddress;
      emit VerificationTask(addedVerifierAddress, index);
      ++activeVerifierInfo[addedVerifierAddress].activeVerificationCount;
    }
  }

  function fetchVerifierAddresses(uint256 index)
    external
    view
    returns (Verifier[] memory)
  {
    return requests[index].selectedVerifiers;
  }

  //EDIT
  function endRequest(uint256 requstIndex) public {
    Request memory request = requests[requstIndex];
    Request storage requestToChange = requests[requstIndex];
    Verifier[] memory verifiers = request.selectedVerifiers;
    require(request.isEnded == false, "request already ended");
    require(
      request.lastAnswerTime <= block.timestamp && request.lastAnswerTime != 0,
      "time has not come yet"
    );
    requestToChange.isEnded = true;
    Answer result;
    uint256 trueAnswerCount;

    if (request.yesCount > request.noCount) {
      result = Answer.NOT_HARMED;
      trueAnswerCount = request.yesCount;
    } else {
      result = Answer.HARMED;
      trueAnswerCount = request.noCount;
    }
    uint256 toBeAddedToPunishmentPool;
    uint256 currentPunishmentPool = request.rewardPool;
    uint256 removedFromPunishmentPool;
    uint256 rewardPool = request.rewardPool;
    for (uint256 i = 0; i < verifiers.length; i++) {
      address currentAddress = verifiers[i].verifierAddress;
      --activeVerifierInfo[currentAddress].activeVerificationCount;
      if (verifiers[i].answer == result) {
        uint256 balanceToAdd;
        balanceToAdd += rewardPool / trueAnswerCount;
        balanceToAdd += currentPunishmentPool / trueAnswerCount;
        removedFromPunishmentPool += currentPunishmentPool / trueAnswerCount;

        activeVerifierInfo[currentAddress].balance += balanceToAdd;
      } else {
        uint256 punishment = (VERIFIER_STAKE * PUNISHMENT) /
          100 /
          (VERIFIER_NUMBER - trueAnswerCount);
        uint256 balanceValue = activeVerifierInfo[currentAddress].balance;
        if (punishment > balanceValue) {
          punishment = balanceValue;
        }
        activeVerifierInfo[currentAddress].balance -= punishment;
        toBeAddedToPunishmentPool += punishment;
      }

      checkStopBeingVerifierAndExecute(currentAddress);
    }

    punishmentPool =
      currentPunishmentPool +
      toBeAddedToPunishmentPool -
      removedFromPunishmentPool;

    if (result == Answer.NOT_HARMED) {
      rentalContract.transferDeposit(request.bicycleId, true);
    } else {
      rentalContract.transferDeposit(request.bicycleId, false);
    }
  }

  function mockEndRequest(uint256 requstIndex) public {
    Request memory request = requests[requstIndex];
    Request storage requestToChange = requests[requstIndex];
    Verifier[] memory verifiers = request.selectedVerifiers;
    require(request.isEnded == false, "request already ended");
    require(
      request.lastAnswerTime <= block.timestamp && request.lastAnswerTime != 0,
      "time has not come yet"
    );
    requestToChange.isEnded = true;
    Answer result;
    uint256 trueAnswerCount;

    if (request.yesCount > request.noCount) {
      result = Answer.NOT_HARMED;
      trueAnswerCount = request.yesCount;
    } else {
      result = Answer.HARMED;
      trueAnswerCount = request.noCount;
    }
    uint256 toBeAddedToPunishmentPool;
    uint256 currentPunishmentPool = request.rewardPool;
    uint256 removedFromPunishmentPool;
    uint256 rewardPool = request.rewardPool;
    for (uint256 i = 0; i < verifiers.length; i++) {
      address currentAddress = verifiers[i].verifierAddress;
      --activeVerifierInfo[currentAddress].activeVerificationCount;
      if (verifiers[i].answer == result) {
        uint256 balanceToAdd;
        balanceToAdd += rewardPool / trueAnswerCount;
        balanceToAdd += currentPunishmentPool / trueAnswerCount;
        removedFromPunishmentPool += currentPunishmentPool / trueAnswerCount;

        activeVerifierInfo[currentAddress].balance += balanceToAdd;
      } else {
        uint256 punishment = (VERIFIER_STAKE * PUNISHMENT) /
          100 /
          (VERIFIER_NUMBER - trueAnswerCount);
        uint256 balanceValue = activeVerifierInfo[currentAddress].balance;
        if (punishment > balanceValue) {
          punishment = balanceValue;
        }
        activeVerifierInfo[currentAddress].balance -= punishment;
        toBeAddedToPunishmentPool += punishment;
      }

      checkStopBeingVerifierAndExecute(currentAddress);
    }

    punishmentPool =
      currentPunishmentPool +
      toBeAddedToPunishmentPool -
      removedFromPunishmentPool;
  }

  function bytesToUint(bytes memory b) internal pure returns (uint256) {
    uint256 number;
    for (uint256 i = 0; i < b.length; i++) {
      number = number + uint256(uint8(b[i])) * (2**(8 * (b.length - (i + 1))));
    }
    return number;
  }

  function checkUpkeep(
    bytes calldata /* checkData */
  )
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory performData)
  {
    upkeepNeeded = false;
    for (uint256 i = 0; i < requests.length; i++) {
      Request memory request = requests[i];

      if (
        (request.isEnded == false &&
          request.lastAnswerTime <= block.timestamp &&
          request.lastAnswerTime != 0) ||
        (request.lastAnswerTime == 0 && request.randomSeed != 0)
      ) {
        upkeepNeeded = true;
        performData = new bytes(32);
        assembly {
          mstore(add(performData, 32), i)
        }
        break;
      }
    }
  }

  function performUpkeep(bytes calldata performData) external override {
    uint256 requestIndex = bytesToUint(performData);
    Request memory request = requests[requestIndex];
    if (
      request.isEnded == false &&
      request.lastAnswerTime <= block.timestamp &&
      request.lastAnswerTime != 0
    ) {
      mockEndRequest(requestIndex);
    }
    if (request.lastAnswerTime == 0 && request.randomSeed != 0) {
      selectVerifiers(request.randomSeed, requestIndex);
      requests[requestIndex].lastAnswerTime = block.timestamp + ANSWER_TIME;
    }
  }

  function viewAllActiveVerifiers() external view returns (address[] memory) {
    return EnumerableSet.values(activeVerifiers);
  }
}

interface Rental {
  function transferDeposit(uint256 bicycleId, bool result) external;
}
