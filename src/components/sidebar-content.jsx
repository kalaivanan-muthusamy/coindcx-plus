import React from "react";
import { Menu } from "antd";
// import SidebarLogo from "./SidebarLogo";
// import UserProfile from "./UserProfile";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from "../constants/theme-settings";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import CustomScrollbars from "./custom-scrollbar";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function SidebarContent(props) {
  const navStyle = props?.uiSettings?.navStyle;
  const themeType = props?.uiSettings?.themeType;

  const getNoHeaderClass = (navStyle) => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  return (
    <>
      {/* <SidebarLogo /> */}
      <div className="gx-layout-sider-header">
      <Link to="/">
        <img
          alt=""
          style={{ height: "35px" }}
          className="gx-d-block gx-d-lg-none gx-pointer gx-mr-xs-3 gx-pt-xs-1 gx-w-logo"
          src={"/images/logo.png"}
        />
      </Link>
      </div>
      <div className="gx-sidebar-content">
        <div
          className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}
        >
          {/* <UserProfile />
          <AppsNavigation /> */}
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            selectedKeys={["/coins/TRX"]}
            mode="inline"
          >
            <MenuItemGroup key="main" className="gx-menu-group" title={"Main"}>
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
            </MenuItemGroup>
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    uiSettings: state.uiSettings,
  };
};

export default connect(mapStateToProps)(SidebarContent);
