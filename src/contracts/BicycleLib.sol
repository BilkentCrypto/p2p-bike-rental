// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

library BicycleLib {
    //This library contains helps create Bicycle Objects for Rental Contracts
    struct Bicycle {
        string make; // Bicycle Model
        bool isAvailable;  // if true, this bicycle can be rented out
        address rentee; // person delegated to
        address owner; //Owner of bicycle
        uint bicyclePrice; // Price of bicycle
        uint year;   // index of the voted proposal
        uint bicycleId; // index of car to be rented 
        uint timePrice;
        uint start;
    }
}
