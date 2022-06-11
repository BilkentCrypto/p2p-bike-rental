import { Card, Timeline, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function QuickStart() {
  return (
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
            <Text style={styles.text}>
              <h1> Check Available Bikes in my area</h1>
              <h3> The BMX bike (2.5km away) is waiting for you to ride it </h3>
              <Link to="/bearentee"> Rent Me! </Link>
            </Text>
          </Timeline.Item>
        </Timeline>
      </Card>
      <div>
        <Card
          style={styles.card}
          title={
            <>
              <Text strong>For Renter(</Text>
            </>
          }
        >
          <Timeline mode="left" style={styles.timeline}>
            <Timeline.Item dot="💿">
              <Text style={styles.text}>
                <h1> I want to check my bicycle's condition</h1>
                <Link to="/bearenter">Renter's Page</Link>
              </Text>
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
              <Text style={styles.text}>
                <h1> I want to verify to earn!</h1>
                <Link to="/bearenter">DAO Contributor!</Link>
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </div>
  );
}
