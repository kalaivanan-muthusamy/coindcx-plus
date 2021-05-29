import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function HorizontalMenu() {
  return (
    <Menu mode="horizontal">
      {/* <Menu.Item key="dashboard">
        <NavLink exact activeClassName="active" to="/coin">
          <i className="icon icon-home" />
          Dashboard
        </NavLink>
      </Menu.Item> */}
      <Menu.Item key="coins">
        <NavLink activeClassName="active" to="/coins">
          <i className="icon icon-crypto" />
          Coins
        </NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default HorizontalMenu;
