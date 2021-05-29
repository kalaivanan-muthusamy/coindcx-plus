import { AutoComplete, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import AppHeader from "./components/header";

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
    <Layout className="gx-app-layout">
      <AppHeader />
      <Content className="gx-layout-content gx-container-wrap">
        <div className="gx-main-content-wrapper">{props.children}</div>
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
