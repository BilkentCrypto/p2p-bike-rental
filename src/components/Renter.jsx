import { Card } from "antd";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { userAddress } from "../config";
import { ethers } from "ethers";
import User from "../contracts/User.json";
import { styles } from "../helpers/styles";
import { Link } from "react-router-dom";
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
        <div style={styles.headerRenter}>
          Hi {"  \n "}
          Firstly, buy a kit
        </div>
      </Card>
    );
  }
  return (
    <Card style={styles.card}>
      <div style={styles.headerRenter}>
        Your bike's Info:
        <h1 style={styles.header2}> Name: {rentals[0]} </h1>
        <h4 style={styles.header4}> Available: {rentals.isAvailable + " "}</h4>
        <h4 style={styles.header4}> (You might need to refresh that)</h4>
        <br />
        <button onClick={changeAvailability} style={styles.button}>
          Change Availability
        </button>
        <br />
        <p> Also, for tutorial purposes: </p>
        <Link to="/buykit"> Want to add your bike? </Link>
      </div>
    </Card>
  );
}
