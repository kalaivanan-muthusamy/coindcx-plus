import { AutoComplete, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const { Header, Content, Footer } = Layout;

function Main(props) {
  const [selectedCoin, setSelectedCoin] = useState(props?.selectedCoin);
  const [searchOptions, setSearchOptions] = useState(null);
  const history = useHistory();

  useEffect(() => {
    props.getAllCoinDetails();
  }, []);

  function onChange(data) {
    setSelectedCoin(data);
  }

  function onSearch(searchText) {
    const stext = searchText.toLowerCase();
    setSearchOptions(
      props?.allCoins?.filter(
        (a) =>
          a?.label?.toLowerCase()?.includes?.(stext) ||
          a?.value?.toLowerCase()?.includes?.(stext)
      )
    );
  }

  function onSelect(value) {
    props?.setSelectedCoin(value);
    history.push(`/coin/${value}`);
  }

  return (
    <Layout>
      <Header
        className="d-flex align-items-center"
        style={{ position: "fixed", zIndex: 1, width: "100%" }}
      >
        <div className="logo" />
        <Menu
          className="w-100"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="1">Coin Details</Menu.Item>
        </Menu>
        <AutoComplete
          value={selectedCoin}
          options={searchOptions || props?.allCoins}
          style={{
            width: 200,
          }}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={onChange}
          placeholder="Select Coin"
        />
      </Header>
      <Content
        className="site-layout pt-4 pb-5"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        {props.children}
      </Content>
      <Footer style={{ textAlign: "center" }}>Created by Kalaivanan</Footer>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    allCoins: state.allCoins,
    marketDetails: state.marketDetails,
    selectedCoin: state.selectedCoin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCoinDetails: () => dispatch({ type: "MARKET_DETAILS_REQUEST" }),
    setSelectedCoin: (coinSymbol) =>
      dispatch({ type: "SET_SELECTED_COIN", payload: { coinSymbol } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
