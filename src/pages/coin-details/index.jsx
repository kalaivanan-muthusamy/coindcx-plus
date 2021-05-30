import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin, Tabs } from "antd";
import {
  UpCircleFilled,
  DownCircleFilled,
  SnippetsFilled,
} from "@ant-design/icons";
import { connect } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import HistoricalDataCoinDCX from "./historical-data-coin-dcx";
import OrderBook from "./order-books";
import TradeHistory from "./trade-history";
import "../../styles/pages/index.scss";
import TradeChart from "./trade-chart";
import Ratings from "./ratings";

const { TabPane } = Tabs;
// const socket = io("ws://stream.coindcx.com", { transports: ["websocket"] });

function CoinDetails(props) {
  const [coinDetails, setCoinDetails] = useState({});
  const { coinSymbol } = useParams();
  const selectedCoin = props.selectedCoin;
  const selectedCoinDetails = props?.marketDetails?.find(
    (a) => a.target_currency_short_name === selectedCoin
  );

  useEffect(() => {
    getInitialDetails();
  }, [coinSymbol]);

  async function getInitialDetails() {
    const priceDetailsAsync = getCurrentPrice();
    const priceChangesAsync = getPriceChanges();
    await Promise.all([priceDetailsAsync, priceChangesAsync]);
    setCoinDetails({
      ...(await priceDetailsAsync),
      ...(await priceChangesAsync),
    });
  }

  useEffect(() => {
    props?.setSelectedCoin(coinSymbol);
  }, []);

  async function getCurrentPrice() {
    try {
      const { data: currentPrices } = await axios.get(
        "https://public.coindcx.com/market_data/current_prices"
      );
      const coinPrice = Object.entries(currentPrices)?.find(
        (price) => price?.[0] === `${coinSymbol}INR`
      )?.[1];
      return {
        price: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(coinPrice),
      };
    } catch (err) {
      console.error(err);
    }
  }

  async function getPriceChanges() {
    try {
      const { data: priceChanges } = await axios.get(
        "https://public.coindcx.com/market_data/price_changes"
      );
      return {
        high: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(priceChanges[`${coinSymbol}INR_high`]),
        low: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(priceChanges[`${coinSymbol}INR_low`]),
        percent_change: new Intl.NumberFormat("en-IN").format(
          priceChanges[`${coinSymbol}INR_percent_change`]
        ),
        vol: new Intl.NumberFormat("en-IN").format(
          priceChanges[`${coinSymbol}INR_vol`]
        ),
      };
    } catch (err) {
      console.error(err);
    }
  }

  function onTabChange() {}

  return (
    <div className="coin-details">
      {selectedCoinDetails ? (
        <Row>
          <Col xs={24}>
            <div className="gx-card">
              <div className="gx-card-body">
                <Row>
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-wel-ema gx-pt-xl-2">
                      <Title className="mb-2">
                        {selectedCoinDetails?.target_currency_name}{" "}
                        <span className="h5 d-inline text-secondary" level={5}>
                          (
                          {selectedCoinDetails?.target_currency_short_name?.toUpperCase()}
                          )
                        </span>
                      </Title>
                      <h2 className="gx-fs-xxxl gx-font-weight-medium">
                        {coinDetails?.price}
                        <span
                          className={`h4 ms-2 gx-chart-${
                            coinDetails?.percent_change > 0 ? "up" : "down"
                          }`}
                        >
                          {coinDetails?.percent_change}%{" "}
                          <i className="icon icon-menu-up gx-fs-sm" />
                        </span>
                      </h2>
                      <ul className="gx-list-group mt-4">
                        <li>
                          <UpCircleFilled />
                          <span className="gx-text-grey">
                            24H High: <span>{coinDetails?.high}</span>
                          </span>
                        </li>
                        <li>
                          <DownCircleFilled />
                          <span className="gx-text-grey">
                            24H Low: <span>{coinDetails?.low}</span>
                          </span>
                        </li>
                        <li>
                          <SnippetsFilled />
                          <span className="gx-text-grey">
                            24H Volume: <span>{coinDetails?.vol}</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Col>

                  <Col xl={16} lg={12} md={12} sm={12} xs={24}>
                    <TradeChart />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
              <TabPane tab="Historical Data" key="1">
                <HistoricalDataCoinDCX coinDetails={selectedCoinDetails} />
              </TabPane>
              <TabPane tab="Ratings" key="2">
                <Ratings coinDetails={selectedCoinDetails} />
              </TabPane>
              <TabPane tab="Order Book" key="3">
                <OrderBook coinDetails={selectedCoinDetails} />
              </TabPane>
              <TabPane tab="Trade History" key="4">
                <TradeHistory coinDetails={selectedCoinDetails} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinDetails);
