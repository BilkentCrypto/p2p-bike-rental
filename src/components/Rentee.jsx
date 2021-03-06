import { Card } from "antd";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { userAddress } from "../config";
import User from "../contracts/User.json";
import { Link } from "react-router-dom";
import { styles } from "../helpers/styles";

// To-do Buy a Kit function

function Rentee() {
  // List all the bikes
  const [stake, setStake] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadBicycles();
  }, []);

  let bikes1 = [];
  async function loadBicycles() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(userAddress, User.abi, signer);
    const bicycleCount = await contract.functions.getBicycleCount();
    const bicInt = parseInt(bicycleCount, 10);
    for (let i = 0; i < bicInt; i++) {
      const bicycleInfo = await contract.functions.rentals(i);
      if (bicycleInfo.isAvailable) {
        await bikes1.push(i);
      }
      console.log("no available");
    }
    const items = await Promise.all(
      bikes1 &&
        bikes1.map(async (i) => {
          const bicycleInfo = await contract.functions.rentals(i);
          console.log("isavail", bicycleInfo.isAvailable);
          let item = {
            name: bicycleInfo[0],
            isAvailable: bicycleInfo.isAvailable,
          };
          return item;
        }),
    );
    setBikes(items);
    setStake(bicycleCount);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !stake.length) {
    return (
      <Card style={styles.card}>
        <div style={styles.headerRentee}>
          Hi {"  \n "}
          No bikes available/stake error
        </div>
      </Card>
    );
  } else {
    return (
      <Card style={styles.card}>
        <div style={styles.headerRentee}>
          <div>
            <h1 style={styles.text}>
              {" "}
              All available bicycles to ride are as follows:{" "}
            </h1>
            <h5 style={styles.text}>
              {" "}
              (Information fetched from the smart contract){" "}
            </h5>
          </div>
          {bikes.length != 0 &&
            bikes.map((bike, index) => (
              <Card key={index} style={styles.card1}>
                <h1> Name: {bike.name + " " + index} </h1>
                <h5> {bike.isAvailable && "available"}</h5>
                <Link to="/rentabike"> Rent a Bike </Link>
              </Card>
            ))}
        </div>
      </Card>
    );
  }
}
export default Rentee;
