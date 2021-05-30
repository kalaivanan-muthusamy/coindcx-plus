import { Layout } from "antd";
import { useEffect } from "react";
import { connect } from "react-redux";
import AppHeader from "./components/header";
import Sidebar from "./components/sidebar";
import io from "socket.io-client";

const { Content, Footer } = Layout;
const socketEndpoint = "ws://stream.coindcx.com";
const socket = io(socketEndpoint, {
  transports: ['websocket']
});
function Main(props) {
  useEffect(() => {
    props.getAllCoinDetails();
    subscribeUpdatePrices();
    return () => {
      unSubscribeUpdatePrices();
    };
  }, []);

  function subscribeUpdatePrices() {
    const channelName = "24_hour_price_changes";
    //Join Channel
    socket.emit("join", {
      channelName: channelName,
    });

    //Listen update on channelName
    socket.on("update-prices", (response) => {
      const updatedPrices = JSON.parse(response.data);
      console.log({ updatedPrices });
    });
  }

  function unSubscribeUpdatePrices() {
    socket.emit("leave", {
      channelName: "24_hour_price_changes",
    });
  }

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
