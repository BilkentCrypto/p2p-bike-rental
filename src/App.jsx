import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Account from "components/Account/Account";
import { Image, Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import QuickStart from "components/QuickStart";
import Text from "antd/lib/typography/Text";
import MenuItems from "./components/MenuItems";
import Renter from "./components/Renter";
import Rentee from "./components/Rentee";
import Rentabike from "./Rentabike";
import { styles } from "./helpers/styles";
const { Header, Footer } = Layout;
import logo from "./assets/apple-touch-icon.png";

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
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Account />
          </div>
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
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>Bilkent Blockchain</Text>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <Image width={70} src={logo} />
  </div>
);

export default App;
