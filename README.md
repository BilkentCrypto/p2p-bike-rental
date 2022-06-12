# P2P-Rent-Bicycle

**It is a dApp that allows users to rent bikes over the rinkeby test network without providing any personal data,
and allows people with bikes to share their bikes with other people and earn money.**

[Rental Contract](https://rinkeby.etherscan.io/address/0x912c973E6A3DAdaee3FBDe072052d627Ece6829B).
[VDAO Contract](https://rinkeby.etherscan.io/address/0x07980Fae9E884c5C72C98cBDf40e0aD70739FFac).
[P2P-Rent-Bicycle-Website](https://p2p-bike-rental.vercel.app/quickstart).

​
## Introduction
 
## Bike-Kit
​
The user who wants to rent his bike should first buy a bike-kit, this is a bike hardware that includes a screen and gps. 
When this user opens the kit, the kit creates an Ethereum address and generates 3 uniquie numbers from this private key 
(V-R-S) using ECDS. The reason we use this method is because the owner of the bike should not know the private key of the bike account [ECDS](SignedMessageVerifier).
​

## Renter
​
The user who buys the kit interacts with the smart contract and adds the V-R-S values, the bike model,
the year of the bike model, bike's account,the price of the bike and the price per minute of the bike [Rental](src/contract/Rental.sol).
​

## Rentee
​
The user who wants to rent a bike can see all the available bikes and the features of these bikes.
In order to rent the bike he wants, he locks the ethereum to the system as a deposit as much as the bike's value 
(it is a precaution in case the bike is stolen or damaged, and VDAO makes this decision), if there is no problem with the bike, he gets his money back. 
The renter of the bike can lock the bike after paying the required fee [Rental](src/contract/Rental.sol).
​

## VDAO (Verifer DAO)
​
We developed VDAO because it is necessary to prevent the renter from causing any damage to the bike 
and the system that controls this system should be a decentralized system. the person who rents the bike 
takes a photo of the bike and sends it to VDAO [VDAO](src/contract/VDAO.sol). Those who want to approve this photo and earn money can be 
included in the system by giving 0.1 ether for now. This money is sent to the owner of the bike,[Rental](src/contract/Rental.sol) and those 
who answer incorrectly are punished with a serious penalty such as 30% cut off. ![Graph](assets/VDAO.png)
​

## P2P-Rent-Bike Diagram
​
![Graph](assets/P2P-Rent-Bicycle.png)
​

## RoadMap

### Rentee
-Royalites/Perks:The amount of deposit paid by those who do not damage the bicycles they use for a certain period of time will be reduced.
-If there is moderate damage to the bike, you will still not have to give the full deposit (the VDAO system will be developed).
### VDAO
-Approvers will see four options: no damage, slight, medium and heavy damage, depending on the voting results, the amount of deposit
sent to the bike owner will gradually increase.
