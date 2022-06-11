import { Button, Card } from "antd";
import { styles } from "../helpers/styles";

const imgURLs = [
  {
    name: "Img 1",
    img: "https://townsquare.media/site/252/files/2019/12/28.png?w=1200&h=0&zc=1&s=0&a=t&q=89",
  },
  {
    name: "Img 2",
    img: "https://townsquare.media/site/252/files/2019/12/28.png?w=1200&h=0&zc=1&s=0&a=t&q=89",
  },
];
export default function DAO() {
  return (
    <Card style={{ ...styles.card, width: "300px" }}>
      <div style={styles.headerRenter}>
        <h4 style={styles.text}>
          Hi there, you are gonna vote here. As a demo: Let's say you are
          already a voter: This is Verify to Earn now, you will get alerts, and
          you will have to vote
        </h4>
        {imgURLs.map((value) => (
          <div>
            <p>{value.name}</p>
            <img src={value.img} />
          </div>
        ))}
        <Button type="primary" style={styles.button}>
          Parked Nice
        </Button>
        <Button style={styles.button} danger type="text">
          No Nice, Bad Boy
        </Button>
      </div>
    </Card>
  );
}
