import { Card } from "antd";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { userAddress } from "../config";
import { ethers } from "ethers";
import User from "../contracts/User.json";
import { styles } from "../helpers/styles";

// To-do Buy a Kit function

export default function Renter() {
  return (
    <Card style={styles.card}>
      <div style={styles.headerRenter}>Hi {"  \n "}</div>
    </Card>
  );
}
