import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { styles } from "../helpers/styles";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={styles.menu}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/quickstart">
        <NavLink to="/quickstart" style={styles.tabLink}>
          🚀 Quick Start
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/bearentee">
        <NavLink to="/bearentee" style={styles.tabLink}>
          👛 RENTEE
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/bearenter">
        <NavLink to="/bearenter" style={styles.tabLink}>
          👛 RENTER
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/dao">
        <NavLink to="/dao" style={styles.tabLink}>👛 DAO</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
