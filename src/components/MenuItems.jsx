import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/quickstart">
        <NavLink to="/quickstart">🚀 Quick Start</NavLink>
      </Menu.Item>
      <Menu.Item key="/bearentee">
        <NavLink to="/bearentee">👛 RENTEE</NavLink>
      </Menu.Item>

      <Menu.Item key="/bearenter">
        <NavLink to="/bearenter">👛 RENTER</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
