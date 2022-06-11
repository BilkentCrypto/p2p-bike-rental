import { Card } from "antd";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { create } from "ipfs-http-client";
import {useState} from "react";

const client = create("https://ipfs.infura.io:5001/api/v0");

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
      title={<div style={styles.header}>asdkfjaslfjsfklj</div>}
    >
      <button>Confirm Ride</button>
      <h2> If confirmed, countdown started: </h2>
      <h3> Stop Countdown *implement a button</h3>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="image/*,audio/*,video/*"
      />
      <input type="file" onChange={onChange} />
      {fileUrl && <img src={fileUrl} width="600px" />}
    </Card>
  );
}
