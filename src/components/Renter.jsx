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
    color: "#fff",
    gap: "5px",
  },
  card: {
    background: "#2f3136",
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
  const [rentals, setRentals] = useState([]);
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
      let item = await contract.functions.rentals(0);
      console.log("Rentals", item);
      console.log("is it false", item.isAvailable);
      setRentals(item);
      setLoadingState("loaded");
    } else {
      console.log("the connection wasn't established");
    }
  }

  async function changeAvailability(e) {
    e.preventDefault();
    console.log("i am here");
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
      await contract.functions.changeAvailable(0);
    } else {
      console.log("the connection wasn't established");
    }
  }

  console.log(rentals);
  // this will be useful if the renter did not register the bike
  //    const addBicycle = await contract.functions.addNewBicycle("testBike", "0x076c8831785a841f81d5e5e1f693c761beceb1b7", 5, 2000);
  if (loadingState === "loaded" && !rentals.length) {
    return (
      <Card style={styles.card}>
        <div style={styles.header}>
          Hi {"  \n "}
          Firstly, buy a kit
        </div>
      </Card>
    );
  }
  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        Hi {"  \n "}
        You have a kit, now:
        <h1 style={{ color: "#fff" }}> Your bicycle info: </h1>
        <h2 style={{ color: "#fff" }}> Do you wanna change it bro?</h2>
        <h3 style={{ color: "#fff" }}> Bike's Name {rentals[0]}</h3>
        <h4 style={{ color: "#fff" }}>
          {" "}
          Bike's availability {rentals.isAvailable}
        </h4>
        <button onClick={changeAvailability} style={{ color: "#000" }}>
          Change Availability
        </button>
      </div>
    </Card>
  );
}
