import Title from "antd/lib/typography/Title";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Tabs } from "antd";
import { connect } from "react-redux";
import HistoricalDataCoinDCX from "./historical-data-coin-dcx";
import OrderBook from "./order-books";
import TradeHistory from "./trade-history";
import '../../styles/pages/index.scss';

const { TabPane } = Tabs;

function Coin(props) {
  const { coinSymbol } = useParams();
  const selectedCoin = props.selectedCoin;
  const selectedCoinDetails = props?.marketDetails?.find(
    (a) => a.target_currency_short_name === selectedCoin
  );

  useEffect(() => {
    console.log({ coinSymbol });
    props?.setSelectedCoin(coinSymbol);
  }, []);

  function onTabChange() {}

  return (
    <div className="coin-details">
      {selectedCoinDetails ? (
        <div>
          <Title>
            {selectedCoinDetails?.target_currency_name}{" "}
            <span className="h5 d-inline text-secondary" level={5}>
              ({selectedCoinDetails?.target_currency_short_name?.toUpperCase()})
            </span>
          </Title>
          <Tabs defaultActiveKey="1" onChange={onTabChange}>
            <TabPane tab="Historical Data (CoinDCX)" key="1">
              <HistoricalDataCoinDCX coinDetails={selectedCoinDetails} />
            </TabPane>
            <TabPane tab="Order Book" key="3">
              <OrderBook coinDetails={selectedCoinDetails} />
            </TabPane>
            <TabPane tab="Trade History" key="4">
              <TradeHistory coinDetails={selectedCoinDetails} />
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <div className="text-center">
          <Spin />
        </div>
      )}
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
    setSelectedCoin: (coinSymbol) =>
      dispatch({ type: "SET_SELECTED_COIN", payload: { coinSymbol } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Coin);
