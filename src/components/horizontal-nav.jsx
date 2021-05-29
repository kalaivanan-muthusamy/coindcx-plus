import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

function HorizontalMenu() {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <Menu selectedKeys={["/coins/TRX"]} mode="horizontal">
      <Menu.Item key="dashboard">
        <NavLink exact activeClassName="active" to="/">
          <i className="icon icon-home" />
          Dashboard
        </NavLink>
      </Menu.Item>
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
