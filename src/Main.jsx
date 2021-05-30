import { Card, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import AppHeader from "./components/header";
import Sidebar from "./components/sidebar";
import axios from "axios";

const { Content, Footer } = Layout;

function Main(props) {
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    props.getAllCoinDetails();
    getCoinPrices();
  }, []);

  async function getCoinPrices() {
    try {
      setIsLoading(true);
      const { data: coinsCurrentPrice } = await axios.get(
        `https://public.coindcx.com/market_data/current_prices`
      );
      props?.setCoinsCurrentPrice(coinsCurrentPrice);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  }

  return (
    <div>
      <Sidebar />
      <Layout className="gx-app-layout">
        <AppHeader />
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper">
            {props?.marketDetails?.length > 0 && !loading ? (
              <>{props.children}</>
            ) : (
              <Card className="gx-card text-center">
                <Spin />
              </Card>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Created by Kalaivanan</Footer>{" "}
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
    setCoinsCurrentPrice: (coinsCurrentPrice) =>
      dispatch({
        type: "SET_COINS_CURRENT_PRICE",
        payload: { coinsCurrentPrice },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
