// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract DAV is VRFConsumerBaseV2 {
  //chainlink for mumbai
  VRFCoordinatorV2Interface COORDINATOR;
  address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
  bytes32 keyHash =
    0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
  uint32 callbackGasLimit = 200000;
  uint16 requestConfirmations = 3;
  uint32 numWords = 1;
  uint64 s_subscriptionId = 325;
  mapping(uint256 => uint256) chainlinkRequestIdToRequestId;

  constructor() VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
  }

  // Add the library methods
  using EnumerableSet for EnumerableSet.AddressSet;

  // Declare a set state variable
  EnumerableSet.AddressSet private activeVerifiers;

  uint256 constant VERIFIER_STAKE = 10;
  uint256 constant ANSWER_TIME = 300;
  uint256 constant VERIFIER_NUMBER = 3;
  uint256 constant PUNISHMENT = 30;
  //AS PERCENT?
  //addrequestte gelen para dağıtılabilir
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
    //contract constructor ekle
    _;
  }

  function addRequest(
    string calldata _oldImageURI,
    string calldata _newImageURI
  ) external payable onlyContract {
    Request storage newRequest = requests.push();
    newRequest.oldImageURI = _oldImageURI;
    newRequest.newImageURI = _newImageURI;
    newRequest.lastAnswerTime = block.timestamp + ANSWER_TIME;
    newRequest.rewardPool = msg.value;

    //random verifier seç

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
    uint256 DAVRequestId = chainlinkRequestIdToRequestId[requestId];
    uint256 randomSeed = randomWords[0] % VERIFIER_NUMBER;
    selectVerifiers(randomSeed, DAVRequestId);
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

  function endRequest(uint256 requstIndex) public {
    Request memory request = requests[requstIndex];
    Request storage requestToChange = requests[requstIndex];
    Verifier[] memory verifiers = request.selectedVerifiers;
    require(request.isEnded == false, "request already ended");
    require(request.lastAnswerTime >= block.timestamp, "time has not come yet");
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
      if (verifiers[i].answer == result) {
        uint256 balanceToAdd;
        balanceToAdd += rewardPool / trueAnswerCount;
        balanceToAdd += currentPunishmentPool / trueAnswerCount;
        removedFromPunishmentPool += currentPunishmentPool / trueAnswerCount;

        activeVerifierInfo[verifiers[i].verifierAddress]
          .balance += balanceToAdd;
      } else {
        uint256 punishment = (VERIFIER_STAKE * PUNISHMENT) /
          100 /
          (VERIFIER_NUMBER - trueAnswerCount);
        uint256 balanceValue = activeVerifierInfo[verifiers[i].verifierAddress]
          .balance;
        if (punishment > balanceValue) {
          punishment = balanceValue;
        }
        activeVerifierInfo[verifiers[i].verifierAddress].balance -= punishment;
        toBeAddedToPunishmentPool += punishment;
      }
    }

    punishmentPool =
      currentPunishmentPool +
      toBeAddedToPunishmentPool -
      removedFromPunishmentPool;

    //run constructor
    //keeper ekle
  }

  function viewAllActiveVerifiers() external view returns (address[] memory) {
    return EnumerableSet.values(activeVerifiers);
  }
}
