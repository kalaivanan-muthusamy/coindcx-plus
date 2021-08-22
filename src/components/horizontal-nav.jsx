import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function HorizontalMenu() {
  return (
    <Menu mode="horizontal">
      <Menu.Item>
        <NavLink activeClassName="active" to="/coins">
          <i className="icon icon-badge" />
          Coins
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink activeClassName="active" to="/market-analysis">
          <i className="icon icon-apps" />
          Market Analysis
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink activeClassName="active" to="/market-watch">
          <i className="icon icon-view" />
          Market Watch
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink activeClassName="active" to="/preferences">
          <i className="icon icon-setting" />
          Preferences
        </NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default HorizontalMenu;
