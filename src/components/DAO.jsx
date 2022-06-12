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
          Hello, you can participate in the voting by giving a certain amount of
          money (for now 0.1⧫ ether) and earn money by giving correct answers.
        </h4>
        {imgURLs.map((value) => (
          <div>
            <p>{value.name}</p>
            <img src={value.img} />
          </div>
        ))}
        <Button type="primary" style={styles.button}>
          Bicycle Condition Nice
        </Button>
        <Button style={styles.button} danger type="text">
          No Nice, Bad Boy
        </Button>
      </div>
    </Card>
  );
}
