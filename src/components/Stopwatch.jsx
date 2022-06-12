import * as React from "react";
import ReactStopwatch from "react-stopwatch";
import { styles } from "../helpers/styles";
import { Card } from "antd";

const Stopwatch = () => (
  <ReactStopwatch
    seconds={0}
    minutes={0}
    hours={0}
    limit="00:00:10"
    onCallback={() => console.log("Finish")}
    render={({ formatted, hours, minutes, seconds }) => {
      return (
        <Card
          style={styles.card1}
          title={<div style={styles.header2}>StopWatch</div>}
        >
          <p style={styles.text}>Formatted: {formatted}</p>
          <p style={styles.text}>Hours: {hours}</p>
          <p style={styles.text}>Minutes: {minutes}</p>
          <p style={styles.text}>Seconds: {seconds}</p>
        </Card>
      );
    }}
  />
);

export default Stopwatch;
