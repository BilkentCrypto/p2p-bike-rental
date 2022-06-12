import { Button, Card, Modal } from "antd";
import { create } from "ipfs-http-client";
import { useState } from "react";
import { styles } from "../helpers/styles";
import Stopwatch from "./Stopwatch";

const client = create("https://ipfs.infura.io:5001/api/v0");

export default function Rentabike() {
  const [fileUrl, updateFileUrl] = useState(``);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      title={<div style={styles.header2}>Ride Information</div>}
    >
      <Stopwatch />
      <h3 style={styles.text}>
        {" "}
        *implement a button* stops timer + takes fee for the ride
      </h3>
      <br />
      <h4 style={styles.header4}>
        {" "}
        Thanks for using our service, please take a photo of the bike
      </h4>
      <Button style={styles.buttonCustom} type="primary" onClick={showModal}>
        Upload!
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h1> Please Make Sure That: </h1>
        <p> The lightning is good (the bike is visible)</p>
        <p> You Parked in an Allowed Space</p>
        <p> There are no damages ( please report if there are )</p>
        <input type="file" onChange={onChange} />
        {fileUrl && <img src={fileUrl} width="600px" />}
      </Modal>
    </Card>
  );
}
