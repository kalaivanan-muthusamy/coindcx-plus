import Title from "antd/lib/typography/Title";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Spin, Tabs } from "antd";
import {
  MailOutlined,
  MessageOutlined,
  BellOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import HistoricalDataCoinDCX from "./historical-data-coin-dcx";
import OrderBook from "./order-books";
import TradeHistory from "./trade-history";
import "../../styles/pages/index.scss";

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
        <Row>
          <Col xs={24}>
            <div className="gx-card">
              <div className="gx-card-body">
                <Row>
                  <Col xl={6} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-wel-ema gx-pt-xl-2">
                      <Title>
                        {selectedCoinDetails?.target_currency_name}{" "}
                        <span className="h5 d-inline text-secondary" level={5}>
                          (
                          {selectedCoinDetails?.target_currency_short_name?.toUpperCase()}
                          )
                        </span>
                      </Title>
                      <ul className="gx-list-group">
                        <li>
                          <MessageOutlined />

                          <span>5 Unread messages</span>
                        </li>
                        <li>
                          <MailOutlined />
                          <span>2 Pending invitations</span>
                        </li>
                        <li>
                          <UnorderedListOutlined />
                          <span>7 Due tasks</span>
                        </li>
                        <li>
                          <BellOutlined />
                          <span>3 Other notifications</span>
                        </li>
                      </ul>
                    </div>
                  </Col>

                  <Col
                    xl={6}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={24}
                    className="gx-audi-col"
                  >
                    {/* <SiteAudience /> */}
                  </Col>

                  <Col
                    xl={12}
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    className="gx-visit-col"
                  >
                    {/* <SiteVisit /> */}
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
              <TabPane tab="Order Book" key="2">
                <OrderBook coinDetails={selectedCoinDetails} />
              </TabPane>
              <TabPane tab="Trade History" key="3">
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

export default connect(mapStateToProps, mapDispatchToProps)(Coin);
