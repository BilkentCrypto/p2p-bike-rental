import { AlignCenterOutlined } from "@ant-design/icons";
import { Card, Col, Row, Timeline, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import { styles } from "../helpers/styles";
const { Text } = Typography;

export default function QuickStart() {
  return (
    <div>
      <Row style={{ margin: "auto" }}>
        <Col span={24} style={{ height: "100vh" }}>
          <Card
            style={{
              ...styles.card,
              width: "50%",
              height: "auto",
              margin: "auto",
            }}
          >
            <h1 style={{ ...styles.text, fontSize: "20px", textAlign: "center" }}>
              Welcome to P2P-Rent-Bike!{" "}
            </h1>
            <p style={styles.text}>
              Rent a bike without giving your information to the central institutions. {" "}
            </p>
            <p style={styles.text}>
              If you already have a bike, register with the system and earn money by sharing your bike. {" "} {" "}
            </p>
            <p style={styles.text}>


              {" "}
            </p>
            <h1 style={{ ...styles.text, fontSize: "20px", textAlign: "center" }}>
              Explore fast!{" "}
            </h1>
            <p style={styles.text}>
              Click on the "Rentee" tab to see the nearest bikes.{" "}
            </p>
            <p style={styles.text}>
              If you want other people to rent your bike,
              you can join the network after entering the "Renter" tab
              and buying a bike kit.
            </p>

          </Card>
        </Col>
      </Row>



      <div id="more"></div>

      <Row gutter={[8, 24]}>
        <Col span={8} style={{ height: "60vh" }}>
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
                <h3 style={styles.text}>
                  {" "}
                  The BMX bike (2.5km away) is waiting for you to ride it{" "}
                </h3>
                <Link to="/bearentee" style={styles.link}>
                  {" "}
                  Rent Me!{" "}
                </Link>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col span={8}>
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
                <h1 style={styles.text}>
                  {" "}
                  I want to check my bicycle's condition
                </h1>
                <Link to="/bearenter" style={styles.link}>
                  Renter's Page
                </Link>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col span={8}>
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
                <Link to="/bearenter" style={styles.link}>
                  DAO Contributor!
                </Link>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
