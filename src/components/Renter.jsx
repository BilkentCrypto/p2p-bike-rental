import { Card } from "antd";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";

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

function Renter() {
  const [kit, setKits] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadKit();
  }, []);

  function loadKit() {
    let items = [1, 2];
    setKits(items);
    setLoadingState("loaded");
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
        </div>
      </Card>
    );
  }
}
export default Renter;
