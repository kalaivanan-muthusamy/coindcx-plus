import { Card, Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import AppHeader from "./components/header";
import Sidebar from "./components/sidebar";
import axios from "axios";
import { massagePriceChangesData } from "./utils/index";

const { Content, Footer } = Layout;

function Main(props) {
  const [loading, setIsLoading] = useState(false);
  

  useEffect(() => {
    props.getAllCoinDetails();
    getCoinPrices();
    const coinPriceIntervalId = setInterval(() => {
      getCoinPrices();
    }, 5000);
    return () => {
      clearInterval(coinPriceIntervalId);
    };
  }, []);

  useEffect(() => {
    let coinPriceChangeIntervalId;
    if (props?.marketDetails && props?.coinsCurrentPrice) {
      getPriceChanges();
      coinPriceChangeIntervalId = setInterval(() => {
        getPriceChanges();
      }, 5000);
    }
    return () => {
      clearInterval(coinPriceChangeIntervalId);
    };
  }, [props?.marketDetails, props?.coinsCurrentPrice]);

  async function getCoinPrices() {
    try {
      const { data: coinsCurrentPrice } = await axios.get(
        `https://public.coindcx.com/market_data/current_prices`
      );
      props?.setCoinsCurrentPrice(coinsCurrentPrice);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getPriceChanges() {
    try {
      const { data: allCoinsPrices } = await axios.get(
        `https://public.coindcx.com/market_data/price_changes`
      );
      const priceChanges = massagePriceChangesData(
        allCoinsPrices,
        props?.marketDetails,
        props?.coinsCurrentPrice
      );
      props?.setCoinsPriceChanges(priceChanges);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Sidebar />
      <Layout className="gx-app-layout">
        <AppHeader />
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper-full">
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
    coinsCurrentPrice: state.coinsCurrentPrice
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
    setCoinsPriceChanges: (priceChanges) =>
      dispatch({
        type: "UPDATE_COINS_PRICE_CHANGE",
        payload: { priceChanges },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
