import { Card } from "antd";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { userAddress } from "../config";
import User from "../contracts/User.json";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    width: "450px",
    fontSize: "16px",
    fontWeight: "500",
  },
};

// To-do Buy a Kit function

function Rentee() {
  // List all the bikes
  const [stake, setStake] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadKit();
  }, []);

  async function loadKit() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(userAddress, User.abi, signer);
    console.log("I am here", contract);
    // this will be useful if the rentee did not register the bike
    //    const addBicycle = await contract.functions.addNewBicycle("testBike", "0x076c8831785a841f81d5e5e1f693c761beceb1b7", 5, 2000);

    const bicycleCount = await contract.functions.getBicycleCount();

    console.log("Bic count", bicycleCount);
    const bicycleInfo = await contract.functions.getRentalBicycleInfo(0);
    console.log("Info", bicycleInfo);
    const rentals = await contract.functions.rentals(0);
    console.log("Rentals", rentals);
    setStake(bicycleCount);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !stake.length) {
    return (
      <Card style={styles.card}>
        <div style={styles.header}>
          Hi {"  \n "}
          Firstly, buy a kit
        </div>
      </Card>
    );
  } else {
    return (
      <Card style={styles.card}>
        <div style={styles.header}>
          Hi {"  \n "}
          You have a kit, now:
        </div>
      </Card>
    );
  }
}
export default Rentee;
