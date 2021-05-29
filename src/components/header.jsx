import { AutoComplete, Layout, Popover } from "antd";
import SearchBox from "./search-box";
import HorizontalMenu from "./horizontal-nav";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useState } from 'react';

const { Header } = Layout;

function AppHeader(props) {
  const [filteredCoins, setFilteredCoins] = useState(null)
  const history = useHistory()

  function onCoinSelect(val) {
    props?.setSelectedCoin(val);
    history.push(`/coins/${val}`);

  }

  function onSearch(searchText) {
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
                  // dispatch(toggleCollapsedSideNav(!navCollapsed));
                }}
              />
            </div>
            <Link to="/">
              <img
                alt=""
                className="gx-d-block gx-d-lg-none gx-pointer gx-mr-xs-3 gx-pt-xs-1 gx-w-logo"
                src={"/images/logo.png"}
              />
            </Link>
            <Link to="/">
              <img
                alt=""
                style={{ height: "40px" }}
                className="gx-d-none gx-d-lg-block gx-pointer gx-mr-xs-5 gx-logo"
                src={"/images/logo.png"}
              />
            </Link>
            <div className="gx-header-search gx-d-none gx-d-lg-flex">
              <AutoComplete
                style={{ width: 250 }}
                options={filteredCoins || props?.allCoins || []}
                placeholder="Search Coin..."
                onSelect={onCoinSelect}
                onSearch={onSearch}
              ></AutoComplete>
            </div>

            <ul className="gx-header-notifications gx-ml-auto">
              <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
                <Popover
                  overlayClassName="gx-popover-horizantal"
                  placement="bottomRight"
                  content={
                    <div className="gx-d-flex">
                      <SearchBox
                        styleName="gx-popover-search-bar"
                        placeholder="Search Coin..."
                        //   onChange={updateSearchChatUser}
                        //   value={searchText}
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
              <li className="gx-user-nav">{/* <UserInfo /> */}</li>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedCoin: (coinSymbol) =>
      dispatch({ type: "SET_SELECTED_COIN", payload: { coinSymbol } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
