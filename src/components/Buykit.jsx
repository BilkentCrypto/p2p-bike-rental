import { Button, Card, Input } from "antd";
import { styles } from "../helpers/styles";

// To-do Buy a Kit function

export default function Buykit() {
  return (
    <Card style={styles.card1}>
      <h1 style={{ color: "#fff", textAlign: "center" }}>
        {" "}
        Enter the (V, R, S) information on the kit and other bike information
        below{" "}
      </h1>
      <h2 style={{ color: "#fff" }}></h2>
      <form>
        <label>Bicycle Model:</label>
        <Input placeholder="Bicycle Model" />
      </form>
      <form>
        <label>Bicycle Price:</label>
        <Input placeholder="Bicycle Price" />
      </form>
      <form>
        <label>Bicycle Year:</label>
        <Input placeholder="Bicycle Year" />
      </form>
      <form>
        <label>Time Price:</label>
        <Input placeholder="Time Price" />
      </form>
      <Button style={styles.buttonCustom} type="primary">
        Submit!
      </Button>
    </Card>
  );
}
