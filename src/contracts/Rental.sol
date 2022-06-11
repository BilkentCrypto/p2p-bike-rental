pragma solidity ^0.8.10;

import {BicycleLib} from "./BicycleLib.sol";

contract Rental {
    
    bool private stopped = false;
    address private manager;
    mapping(address => bool) public kitaddresses;

     // The constructor. We assign the manager to be the creator of the contract.It could be enhanced to support passing maangement off.
    constructor() public  
    {
        manager = msg.sender;
    }

    //Check if sender isAdmin, this function alone could be added to multiple functions for manager only method calls
    modifier isAdmin() {
        require(msg.sender == manager);
        _;
    }
    function updateKitaddress(address newKitaddress) public isAdmin{
      
      kitaddresses[newKitaddress] = true;
   }
   


    //Check if the contracts features are deactivated
    function getStopped() public view returns(bool) { return stopped; }

    
    function toggleContractActive() isAdmin public {
    // You can add an additional modifier that restricts stopping a contract to be based on another action, such as a vote of users
        stopped = !stopped;
    }


    //Number of Bicycle savailable for rent
    BicycleLib.Bicycle[] public rentals;

    
  function getBicycleCount() public view returns( uint ) {

    return rentals.length;
  }
    //Renting a bicycle
    function rentBiycycle(uint bicycleId) external payable returns (bool) { 
    require (msg.value>= rentals[bicycleId].bicyclePrice);
       
      require(!stopped); 
        
        
       //Validate bicycleId is within array
      uint totalBicycle = getBicycleCount();
      
    //There must be a bicycle to rent and ID # must be within range 
      require(bicycleId >= 0 && bicycleId < totalBicycle);
    
    //Reference to the bicyclethat will be rented 
    BicycleLib.Bicycle storage bicycleToBeRented = rentals[bicycleId];
    
    //bicycle must be available
    
      
 

    require(bicycleToBeRented.isAvailable == true);
       

        rentals[bicycleId].start = block.timestamp;
        //Assign Rentee to Sender
        bicycleToBeRented.rentee = msg.sender;
      
        //Remove Availability
        bicycleToBeRented.isAvailable = false; 
        return true;

      
      
    }
  function calculateValue(uint bicycleId) public view returns (uint) {
    uint finish;
    uint value;
    uint start;
    uint timePrice;
    BicycleLib.Bicycle storage bicycleToBeRented = rentals[bicycleId];
    timePrice = rentals[bicycleId].timePrice;
    finish=block.timestamp;
    start = rentals[bicycleId].start;
    value = ((finish-start)*timePrice);
    return(value);
  }
  function unlockBiycycle(uint bicycleId) external payable{
    BicycleLib.Bicycle storage bicycleRented = rentals[bicycleId];
    require (msg.value >= calculateValue(bicycleId));
      
      require(bicycleRented.isAvailable == false);
        //Assign Rentee to Sender
        require(bicycleRented.rentee == msg.sender);
      
        //Remove Availability
        bicycleRented.isAvailable = true; 
       


  }
      
      
    
    // Retrieving the bicycle data necessary for user
    function getRentalBicycleInfo(uint bicycleId) public view returns (string memory,bool, address, address,uint, uint, uint,uint) {
      
      uint totalBicycles = getBicycleCount();
      require(bicycleId >= 0 && bicycleId < totalBicycles);
      
      //Get specified bicycle
      BicycleLib.Bicycle memory specificBicycle = rentals[bicycleId];
      
      //Return data considered in rental process
      return (specificBicycle.make, specificBicycle.isAvailable, specificBicycle.owner ,specificBicycle.rentee,specificBicycle.bicyclePrice, specificBicycle.year , specificBicycle.bicycleId, specificBicycle.timePrice);
    }

    //Add RentableBicycle
    function addNewBicycle(string memory make,uint bicyclePrice, uint year,uint timePrice,address _bikeaddress, uint8 _v, bytes32 _r, bytes32 _s) public  returns (uint) {
        require(!stopped); 
        require(VerifyMessage(_bikeaddress,  _v,  _r, _s));
        require(kitaddresses[_bikeaddress]==true);
        //Create bicycle object within function
        
        //Current # of Bicycles
        uint count = getBicycleCount();
        //Increment Count
        //Construct Bicycle Object
        BicycleLib.Bicycle memory newBicycle = BicycleLib.Bicycle(make,true, address(0), msg.sender,bicyclePrice, year,count, timePrice,0);
        
        //Add to Array
        rentals.push(newBicycle);
        
         return count;
    }
   function changeAvailable(uint bicycleId) public returns(bool){
     require(msg.sender == rentals[bicycleId].owner);
     rentals[bicycleId].isAvailable = !rentals[bicycleId].isAvailable;
     return true;
   }
   function VerifyMessage(address _bikeaddress, uint8 _v, bytes32 _r, bytes32 _s) public pure returns (bool) {
        bytes32 prefixedHashMessage = 0x1152db4e3f3af0eb2933f1bdfe5ee2db6a0b32be94f33c1548b09f733e4d8129; // hash of approved message 
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return signer==_bikeaddress;
   }

   
  
}



  
