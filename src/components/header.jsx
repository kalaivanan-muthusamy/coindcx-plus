import { AutoComplete, Layout, Popover, Menu } from "antd";
import HorizontalMenu from "./horizontal-nav";
import { Link, NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useState } from "react";
import { THEME_TYPE_LITE } from "../constants/theme-settings";

const { Header } = Layout;

function AppHeader(props) {
  const [filteredCoins, setFilteredCoins] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const themeType = props?.uiSettings?.themeType;

  function onCoinSelect(val) {
    const marketInfo = props?.marketMetaDetails?.find(
      (a) => a.coindcx_name === val
    );
    props?.setSelectedCoin(val, marketInfo?.pair);
    setOpen(false);
    setSearchText("");
    setFilteredCoins(props?.allCoins);
    setPopoverOpen(false);
    history.push(`/coins/${marketInfo?.coindcx_name}`);
  }

  function onSearch(searchText) {
    setSearchText(searchText);
    const stext = searchText.toLowerCase();
    setFilteredCoins(
      props?.allCoins?.filter(
        (a) =>
          a?.label?.toLowerCase()?.includes?.(stext) ||
          a?.value?.toLowerCase()?.includes?.(stext)
      )
    );
  }

  return (
    <div className="gx-header-horizontal gx-header-horizontal-dark gx-below-header-horizontal">
      <Header className="gx-header-horizontal-main">
        <div className="gx-container">
          <div className="gx-header-horizontal-main-flex">
            <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
              <i
                className="gx-icon-btn icon icon-menu"
                onClick={() => {
                  props?.toggleCollapsedSideNav(
                    !props?.uiSettings?.navCollapsed
                  );
                }}
              />
            </div>
            <Link to="/">
              <img
                alt=""
                style={{ height: "35px" }}
                className="gx-d-block gx-d-lg-none gx-pointer gx-mr-xs-3 gx-pt-xs-1 gx-w-logo"
                src={"/logo.svg"}
              />
            </Link>
            <Link to="/">
              <img
                alt=""
                style={{ height: "25px" }}
                className="gx-d-none gx-d-lg-block gx-pointer gx-mr-xs-5 gx-logo"
                src={"/logo.svg"}
              />
            </Link>
            <div className="gx-header-search gx-d-none gx-d-lg-flex">
              <AutoComplete
                open={open}
                value={searchText}
                style={{ width: 250 }}
                options={filteredCoins || props?.allCoins || []}
                placeholder="Search Coin..."
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onSelect={onCoinSelect}
                onSearch={onSearch}
              ></AutoComplete>
            </div>

            <ul className="gx-header-notifications gx-ml-auto">
              <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
                <Popover
                  overlayClassName="gx-popover-horizantal"
                  placement="bottomRight"
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  visible={popoverOpen}
                  content={
                    <div className="gx-d-flex">
                      <AutoComplete
                        open={open}
                        value={searchText}
                        styleName="gx-popover-search-bar"
                        placeholder="Search Coin..."
                        style={{ width: 250 }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setOpen(false)}
                        options={filteredCoins || props?.allCoins || []}
                        onSelect={onCoinSelect}
                        onSearch={onSearch}
                      />
                    </div>
                  }
                  trigger="click"
                >
                  <span className="gx-pointer gx-d-block">
                    <i className="icon icon-search-new" />
                  </span>
                </Popover>
              </li>
              <li className="gx-user-nav">
                <Menu
                  selectedKeys={["/coins/TRX"]}
                  mode="inline"
                >
                  <Menu.Item>
                    <NavLink to="/auth">
                      <i className="icon icon-user" />
                      Sign In
                    </NavLink>
                  </Menu.Item>
                </Menu>
              </li>
            </ul>
          </div>
        </div>
      </Header>
      <div className="gx-header-horizontal-nav gx-header-horizontal-nav-curve gx-d-none gx-d-lg-block">
        <div className="gx-container">
          <div className="gx-header-horizontal-nav-flex">
            <HorizontalMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    allCoins: state.allCoins,
    uiSettings: state.uiSettings,
    marketMetaDetails: state.marketMetaDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCollapsedSideNav: (navCollapsed) =>
      dispatch({ type: "TOGGLE_COLLAPSED_NAV", payload: { navCollapsed } }),
    setSelectedCoin: (coinSymbol, coinPair) =>
      dispatch({
        type: "SET_SELECTED_COIN",
        payload: { coinSymbol, coinPair },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
