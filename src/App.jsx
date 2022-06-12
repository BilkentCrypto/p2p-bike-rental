import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import QuickStart from "components/QuickStart";
import MenuItems from "./components/MenuItems";
import Renter from "./components/Renter";
import Rentee from "./components/Rentee";
import Rentabike from "./components/Rentabike";
import { styles } from "./helpers/styles";
import DAO from "./components/DAO";
const { Header, Footer } = Layout;

const App = () => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <MenuItems />
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/quickstart">
              <QuickStart />
            </Route>
            <Route path="/bearenter">
              <Renter />
            </Route>
            <Route path="/bearentee">
              <Rentee />
            </Route>
            <Route path="/rentabike">
              <Rentabike />
            </Route>
            <Route path="/dao">
              <DAO />
            </Route>
            <Route path="/">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
        <Footer style={{ textAlign: "center" }}>
          <a
            style={{ display: "block" }}
            href="https://twitter.com/blkntblockchain"
          >
            {" "}
            Bilkent Blockchain Society
          </a>
        </Footer>
      </Router>
    </Layout>
  );
};
export default App;
