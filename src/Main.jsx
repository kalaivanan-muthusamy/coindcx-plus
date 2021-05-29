import { Layout } from "antd";
import { useEffect } from "react";
import { connect } from "react-redux";
import AppHeader from "./components/header";
import Sidebar from "./components/sidebar";

const { Content, Footer } = Layout;

function Main(props) {
  useEffect(() => {
    props.getAllCoinDetails();
  }, []);

  return (
    <div>
      <Sidebar />
      <Layout className="gx-app-layout">
        <AppHeader />
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper">{props.children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Created by Kalaivanan</Footer>
      </Layout>
    </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
