import { Button, Card } from "antd";
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
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    padding: "0 10px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
  },
};

export default function DAO() {
  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        Hi there, you are gonna vote here. As a demo: Let's say you are already
        a voter: This is Verify to Earn now, you will get alerts, and you will
        have to vote
        <img src="https://townsquare.media/site/252/files/2019/12/28.png?w=1200&h=0&zc=1&s=0&a=t&q=89" />
        <Button type="primary">Parked Nice</Button>
        <br />
        <Button danger type="text">
          No Nice, Bad Boy
        </Button>
      </div>
    </Card>
  );
}
