import { Card } from "antd";
import { create } from "ipfs-http-client";
import { useState } from "react";
import { styles } from "./helpers/styles";

const client = create("https://ipfs.infura.io:5001/api/v0");

export default function Rentabike() {
  const [fileUrl, updateFileUrl] = useState(``);
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <Card
      style={styles.card}
      title={<div style={styles.headerRentBike}>asdkfjaslfjsfklj</div>}
    >
      <button>Confirm Ride</button>
      <h2> If confirmed, countdown started: </h2>
      <h3> Stop Countdown *implement a button</h3>

      <input type="file" onChange={onChange} />
      {fileUrl && <img src={fileUrl} width="600px" />}
    </Card>
  );
}
