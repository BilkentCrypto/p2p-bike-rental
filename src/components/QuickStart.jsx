import { Card, Timeline, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../helpers/styles"
const { Text } = Typography;

export default function QuickStart() {
  return (
    <div style={{ width: '60%' }}>
    <div style={{ display: "flex", gap: "10px" }}>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>I'm a Bike User</Text>
          </>
        }
      >
        <Timeline mode="left" style={styles.timeline}>
          <Timeline.Item dot="📄">
              <h1 style={styles.text}> Check Available Bikes in my area</h1>
              <h3 style={styles.text}> The BMX bike (2.5km away) is waiting for you to ride it </h3>
              <Link to="/bearentee" style={styles.link}> Rent Me! </Link>
          </Timeline.Item>
        </Timeline>
      </Card>
      <div>
        <Card
          style={styles.card}
          title={
            <>
              <Text strong>For Renter</Text>
            </>
          }
        >
          <Timeline mode="left" style={styles.timeline}>
            <Timeline.Item dot="💿">
              <h1 style={styles.text}> I want to check my bicycle's condition</h1>
              <Link to="/bearenter" style={styles.link}>Renter's Page</Link>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
      <div>
        <Card
          style={{ marginTop: "10px", ...styles.card }}
          title={
            <>
              📡 <Text strong> Validator's Info</Text>
            </>
          }
        >
          <Timeline mode="left" style={styles.timeline}>
            <Timeline.Item dot="💿">
                <h1 style={styles.text}> I want to verify to earn!</h1>
                <Link to="/bearenter" style={styles.link}>DAO Contributor!</Link>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </div>
    </div>
  );
}
