// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract VDAO is VRFConsumerBaseV2, KeeperCompatibleInterface {


    //chainlink for mumbai
    VRFCoordinatorV2Interface COORDINATOR;
    address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 callbackGasLimit = 200000;
    uint16 requestConfirmations = 3;
    uint32 numWords =  1;
    uint64 s_subscriptionId = 325;
    mapping( uint => uint ) chainlinkRequestIdToRequestId;

    constructor() VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    }

    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;

    // Declare a set state variable
    EnumerableSet.AddressSet private activeVerifiers;
    
    uint constant VERIFIER_STAKE = 10; 
    uint constant ANSWER_TIME = 60;
    uint constant VERIFIER_NUMBER = 3;
    uint constant PUNISHMENT = 30;
//AS PERCENT?
//addrequestte gelen para dağıtılabilir
    uint constant RANDOM_PRIME = 325778765244908313467197;
    uint constant MOD_OF_RANDOM = 100000000000000000000;


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
        uint lastAnswerTime;
        bool isEnded;
        uint yesCount;
        uint noCount;
        uint rewardPool;
        Verifier[] selectedVerifiers;

    }


    mapping( address => ActiveVerifier ) public activeVerifierInfo;
    Request[] public requests;
    uint punishmentPool;
    

    struct ActiveVerifier {
        uint activeVerificationCount;
        bool activenessRequest;
        uint balance;
    } 


    function beActiveVerifier() external payable {
        address msgSender = msg.sender; //to reduce gas fees
        require(msg.value == VERIFIER_STAKE , "not enough stake" );
        require( activeVerifierInfo[ msgSender ].balance == 0, "already have balance"  );
        require( EnumerableSet.contains( activeVerifiers, msgSender ) == false, "already verifier" );
        activeVerifierInfo[ msgSender ].activenessRequest = true;
        EnumerableSet.add( activeVerifiers, msgSender );
        activeVerifierInfo[ msgSender ].balance = VERIFIER_STAKE;

    }


    function stopRequestingVerifications() external {
        address msgSender = msg.sender;
        require( EnumerableSet.contains( activeVerifiers, msgSender ), "not verifier"  );
        EnumerableSet.remove( activeVerifiers, msgSender );
        activeVerifierInfo[ msgSender ].activenessRequest = false;
    }


    function checkStopBeingVerifierAndExecute( address verifierAddress ) internal {
        
        ActiveVerifier memory verifier = activeVerifierInfo[ verifierAddress ];
        if( verifier.activenessRequest == false ) {
            if( verifier.balance > 0 && verifier.activeVerificationCount == 0 ) {
                verifier.balance = 0;
                payable( verifierAddress ).send( verifier.balance );
            
            }
        }



    }

    modifier onlyContract {
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
            newRequest.rewardPool = msg.value;

        //random verifier seç

        uint requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        
    chainlinkRequestIdToRequestId[ requestId ] = requests.length - 1;


    }


    function getIndex( Verifier[] memory addressArray, address addressToSearch ) internal pure returns( uint ) {
        
        for( uint i = 0; i < addressArray.length; i++ ) {
            if( addressArray[ i ].verifierAddress == addressToSearch ) {
                return i;
            }
        
        }
        require( false, "not verifier in that request" );
    }
    
    //true if not harmed false if it is harmed
    function giveAnswer( uint requestId, bool answer) external {
        require( requests[ requestId ].lastAnswerTime <= block.timestamp && requests[ requestId ].lastAnswerTime != 0, "time has not come yet" );
        address msgSender = msg.sender;
        uint index = getIndex( requests[ requestId ].selectedVerifiers, msgSender );
        if( answer == true ) {
            ++requests[ requestId ].yesCount;
            requests[ requestId ].selectedVerifiers[index].answer = Answer.NOT_HARMED;
        } else {
            ++requests[ requestId ].noCount;
            requests[ requestId ].selectedVerifiers[index].answer = Answer.HARMED;
        }

    }


    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        
        uint VDAORequestId = chainlinkRequestIdToRequestId[ requestId ];
        uint randomSeed = randomWords[0] % VERIFIER_NUMBER;
        selectVerifiers( randomSeed, VDAORequestId );
        requests[ VDAORequestId ].lastAnswerTime = block.timestamp + ANSWER_TIME;
 
  }

    function selectVerifiers( uint randomSeed, uint index ) internal {
        uint setLength = EnumerableSet.length( activeVerifiers );



        for( uint i = 0; i < VERIFIER_NUMBER; i++ ) {
            uint randomIndex = ( i * RANDOM_PRIME + randomSeed ) % setLength;
            address addedVerifierAddress = EnumerableSet.at( activeVerifiers, randomIndex );
            Verifier storage verifier = requests[index].selectedVerifiers.push();
            verifier.verifierAddress = addedVerifierAddress;
            ++activeVerifierInfo[ addedVerifierAddress ].activeVerificationCount;          
        }            
        

        
    }

    function fetchVerifierAddresses( uint index ) external view returns( Verifier[] memory ) {
        return requests[index].selectedVerifiers;
    }

    function endRequest( uint requstIndex ) public {
        Request memory request = requests[ requstIndex ];
        Request storage requestToChange = requests[ requstIndex ];
        Verifier[] memory verifiers = request.selectedVerifiers;
        require( request.isEnded == false, "request already ended" );
        require( request.lastAnswerTime <= block.timestamp && request.lastAnswerTime != 0, "time has not come yet" );
        requestToChange.isEnded = true;
        Answer result;
        uint trueAnswerCount;

        if( request.yesCount > request.noCount ) {
            result = Answer.NOT_HARMED;
            trueAnswerCount = request.yesCount;
        } else {
            result = Answer.HARMED;
            trueAnswerCount = request.noCount;
        }
        uint toBeAddedToPunishmentPool;
        uint currentPunishmentPool = request.rewardPool;
        uint removedFromPunishmentPool;
        uint rewardPool = request.rewardPool;
        for( uint i = 0; i < verifiers.length; i++ ) {

            address currentAddress = verifiers[i].verifierAddress;
            --activeVerifierInfo[ currentAddress ].activeVerificationCount;
            if(verifiers[i].answer == result) {
                uint balanceToAdd;
                balanceToAdd += rewardPool / trueAnswerCount;
                balanceToAdd += currentPunishmentPool / trueAnswerCount;
                removedFromPunishmentPool += currentPunishmentPool / trueAnswerCount;

                activeVerifierInfo[ currentAddress ].balance += balanceToAdd;
            } else {
                uint punishment = VERIFIER_STAKE * PUNISHMENT / 100 / (VERIFIER_NUMBER - trueAnswerCount);
                uint balanceValue = activeVerifierInfo[ currentAddress ].balance;
                if( punishment > balanceValue ) {
                    punishment = balanceValue;
                }
                activeVerifierInfo[ currentAddress ].balance -= punishment;
                toBeAddedToPunishmentPool += punishment;
            }

            checkStopBeingVerifierAndExecute( currentAddress );
        }

        punishmentPool = currentPunishmentPool + toBeAddedToPunishmentPool - removedFromPunishmentPool;
        

        

//run constructor
//keeper ekle
        
    }

function toBytes(uint x) internal returns (bytes memory b) {
    b = new bytes(32);
    assembly { mstore(add(b, 32), x) }
}

function bytesToUint(bytes memory b) internal pure returns (uint){
        uint number;
        for(uint i=0;i<b.length;i++){
            number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
        }
    return number;
}


function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData ) {
        upkeepNeeded = false;
        for( uint i = 0; i < requests.length; i++ ) {
            Request memory request = requests[ i ];

            if( request.isEnded == false && request.lastAnswerTime <= block.timestamp && request.lastAnswerTime != 0 ) {
                upkeepNeeded = true;
                performData = new bytes(32);
                assembly { mstore(add(performData, 32), i) }
                break;
            }
        } 
    }

function performUpkeep(bytes calldata performData) external override {
     uint requestIndex = bytesToUint( performData );
     endRequest( requestIndex );
    }

function viewAllActiveVerifiers() external view returns ( address[] memory ) {
    return EnumerableSet.values( activeVerifiers );
}




}


