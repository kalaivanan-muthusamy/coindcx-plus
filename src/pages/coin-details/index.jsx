import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row, Spin, Table, Tabs } from "antd";
import {
  UpCircleFilled,
  DownCircleFilled,
  SnippetsFilled,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { Input } from "antd";

import HistoricalDataCoinDCX from "./historical-data-coin-dcx";
import OrderBook from "./order-books";
import TradeHistory from "./trade-history";
import "../../styles/pages/index.scss";
import Ratings from "./ratings";
import HistoryCandleChart from "./history-candle-chart";

const { Search } = Input;

const coinsColumns = [
  {
    title: "Coin",
    dataIndex: "coin",
    key: "coin",
    render: (text, record) => {
      return (
        <div className="coin-info">
          <span className="coin-name">{text}</span>
          <span className={`coin-price`}>{record.price}</span>
        </div>
      );
    },
  },
  {
    title: "Change",
    dataIndex: "change",
    key: "change",
    align: "right",
    sorter: (a, b) => a.change - b.change,
    render: (text, record) => {
      return (
        <div className="price-change">
          <div className="price-value">
            {parseFloat(record.change).toFixed(2)}%
          </div>
          <div className={record.change > 0 ? "price-plus" : "price-minus"} />
        </div>
      );
    },
  },
];

const { TabPane } = Tabs;

function CoinDetails(props) {
  const { coinSymbol } = useParams();
  const selectedCoin = props.selectedCoin;
  const selectedCoinDetails = props?.marketDetails?.find(
    (a) => a.coindcx_name === selectedCoin
  );
  const coinDetails = props?.coinsPriceChanges?.[selectedCoin];
  const history = useHistory();
  const [marketStatus, setMarketStatus] = useState([]);
  const [searchText, setSearchText] = useState(null);

  useEffect(() => {
    const coinName = coinSymbol.toUpperCase();
    const marketInfo = props?.marketDetails?.find(
      (a) => a.coindcx_name === coinName
    );
    if (!marketInfo) return history.push("/coins");
    props?.setSelectedCoin(coinSymbol.toUpperCase(), marketInfo.pair);
  }, [coinSymbol]);

  useEffect(() => {
    updateCoinsData(searchText);
  }, [props?.marketDetails, props?.coinsCurrentPrice]);

  function onTabChange() {}

  function updateCoinsData(searchText) {
    let marketDetails = props?.marketDetails;
    if (searchText) {
      marketDetails = marketDetails?.filter((coinInfo) => {
        const fullName = coinInfo?.coindcx_name?.toLowerCase();
        const symbol = coinInfo?.target_currency_name?.toLowerCase();
        return (
          fullName.includes(searchText.toLowerCase()) ||
          symbol.includes(searchText.toLowerCase())
        );
      });
    }
    const marketStatus = marketDetails.map((market) => ({
      coinDCXName: market?.coindcx_name,
      coin: market?.target_currency_name,
      price: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: market?.base_currency_short_name,
      }).format(props?.coinsCurrentPrice?.[market?.coindcx_name]),
      change:
        props?.coinsPriceChanges?.[market?.coindcx_name]?.percentageChangeValue,
    }));
    setMarketStatus(marketStatus);
  }

  function updateCoin(record) {
    setSearchText(null);
    updateCoinsData(null);
    history.push(`/coins/${record?.coinDCXName}`);
  }

  function onSearch(event) {
    const val = event.target.value;
    setSearchText(val);
    updateCoinsData(val);
  }

  return (
    <div className="coin-details">
      {selectedCoinDetails ? (
        <Row>
          <Col xs={0} sm={0} md={6} lg={6} xl={6}>
            <div className="gx-card">
              <div className="gx-card-body ps-3 pe-0">
                <Search
                  className="pe-3"
                  value={searchText}
                  placeholder="Search Coin"
                  onChange={onSearch}
                />
                <div className="coin-list">
                  <Table
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          updateCoin(record);
                        },
                      };
                    }}
                    className=""
                    scroll={{ x: "100%" }}
                    size="small"
                    pagination={false}
                    dataSource={marketStatus}
                    columns={coinsColumns}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <div className="gx-card">
              <div className="gx-card-body">
                <Row>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
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
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(props?.coinsCurrentPrice?.[coinSymbol])}
                        <span
                          className={`h4 ms-2 gx-chart-${
                            coinDetails?.percentageChangeValue > 0
                              ? "up"
                              : "down"
                          }`}
                        >
                          {coinDetails?.percentageChangeValue}%{" "}
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
                            24H Volume: <span>{coinDetails?.volume}</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <HistoryCandleChart coinDetails={selectedCoinDetails} />
                  </Col>
                </Row>
              </div>
            </div>
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
          <Col xs={18}></Col>
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
    coinsCurrentPrice: state.coinsCurrentPrice,
    coinsPriceChanges: state.coinsPriceChanges,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedCoin: (coinSymbol, coinPair) =>
      dispatch({
        type: "SET_SELECTED_COIN",
        payload: { coinSymbol, coinPair },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinDetails);
