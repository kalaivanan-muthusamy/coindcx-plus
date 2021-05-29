import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Drawer, Layout } from "antd";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
} from "../constants/theme-settings";
import SidebarContent from "./sidebar-content";

const { Sider } = Layout;

function Sidebar(props) {
  const onToggleCollapsedNav = () => {
    props?.toggleCollapsedSideNav(!props?.uiSettings?.navCollapsed);
  };

  useEffect(() => {
    props?.updateWindowWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      props?.updateWindowWidth(window.innerWidth);
    });
  }, []);

  let drawerStyle = "gx-collapsed-sidebar";
  const navStyle = props?.uiSettings?.navStyle;
  if (navStyle === NAV_STYLE_FIXED) {
    drawerStyle = "";
  } else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
    drawerStyle = "gx-mini-sidebar gx-mini-custom-sidebar";
  } else if (navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
    drawerStyle = "gx-custom-sidebar";
  } else if (navStyle === NAV_STYLE_MINI_SIDEBAR) {
    drawerStyle = "gx-mini-sidebar";
  } else if (navStyle === NAV_STYLE_DRAWER) {
    drawerStyle = "gx-collapsed-sidebar";
  }
  if (
    (navStyle === NAV_STYLE_FIXED ||
      navStyle === NAV_STYLE_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) &&
    props?.uiSettings?.screenWidth < TAB_SIZE
  ) {
    drawerStyle = "gx-collapsed-sidebar";
  }
  return (
    <Sider
      className={`gx-app-sidebar gx-layout-sider-dark ${drawerStyle}`}
      trigger={null}
      collapsed={
        props?.uiSettings?.screenWidth < TAB_SIZE
          ? false
          : navStyle === NAV_STYLE_MINI_SIDEBAR ||
            navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR
      }
      theme={"dark"}
      collapsible
    >
      {navStyle === NAV_STYLE_DRAWER ||
      props?.uiSettings?.screenWidth < TAB_SIZE ? (
        <Drawer
          className={`gx-drawer-sidebar gx-drawer-sidebar-dark`}
          placement="left"
          closable={false}
          onClose={onToggleCollapsedNav}
          visible={!props?.uiSettings?.navCollapsed}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <></>
      )}
    </Sider>
  );
}

const mapStateToProps = (state) => {
  return {
    uiSettings: state.uiSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateWindowWidth: (screenWidth) =>
      dispatch({ type: "UPDATE_SCREEN_WIDTH", payload: { screenWidth } }),
    toggleCollapsedSideNav: (navCollapsed) =>
      dispatch({ type: "TOGGLE_COLLAPSED_NAV", payload: { navCollapsed } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
