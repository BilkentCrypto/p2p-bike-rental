import { Card } from "antd";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import axios from "axios";

import { userAddress } from "../config";
import { ethers } from "ethers";
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
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    padding: "0 10px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
  },
};

const bikeProperty = {
  id: "0",
  name: "BMX",
  price: "200",
  year: "2020",
};

// To-do Buy a Kit function

export default function Renter() {
  // List the bike of one person
  // Change the availability of the bike
  const [kit, setKits] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadKit();
  }, []);

  async function loadKit() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    console.log("wtf");
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    if (provider) {
      const signer = provider.getSigner();

      const contract = new ethers.Contract(userAddress, User.abi, signer);
      console.log("I am here", contract);
      // this will be useful if the rentee did not register the bike
      //    const addBicycle = await contract.functions.addNewBicycle("testBike", "0x076c8831785a841f81d5e5e1f693c761beceb1b7", 5, 2000);
      console.log("lan");
      const bicycleCount = await contract.functions.getBicycleCount();
      console.log("Bic count", bicycleCount);
      const bicycleInfo = bikeProperty;
      const rentals = await contract.functions.rentals(0);
      console.log("Rentals", rentals);
      setKits(bicycleCount);
      setLoadingState("loaded");
    } else {
      console.log("the connection wasn't established");
    }
  }

  async function changeAvailability(e) {
    e.preventDefault();
    console.log("i am here");
  }

  if (loadingState === "loaded" && !kit.length) {
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
          <h1> Your bicycle info: </h1>
          <h2> DO you wanna change it bro?</h2>
          <button onClick={changeAvailability}> Change Availability</button>
        </div>
      </Card>
    );
  }
}
