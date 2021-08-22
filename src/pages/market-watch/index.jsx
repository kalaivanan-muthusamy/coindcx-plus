import { Card, Col, Row, Form, Select, Button, Spin } from "antd";
import CandleStickChart from "./../../components/charts/CandleStick";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { shuffleArray } from "./../../utils/array";

const { Option } = Select;

function MarketWatch({ marketMetaDetails }) {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    interval: "2h",
    category: "Favorite",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    interval: "2h",
    category: "Favorite",
  });
  const [candleData, setCandleData] = useState([]);
  const preferredCoins = JSON.parse(
    localStorage.getItem("preferredCoins") || "[]"
  );

  useEffect(() => {
    getOHLC();
  }, []);

  async function getOHLC() {
    try {
      setLoading(true);
      let ohlc = [];
      const filteredCoins = marketMetaDetails.filter((c) =>
        preferredCoins.includes(c.pair)
      );
      const selectedMarkets =
        filteredCoins?.length > 50
          ? shuffleArray(filteredCoins)?.slice(0, 50)
          : filteredCoins;
      console.log(selectedMarkets);
      const responses = selectedMarkets.map(async (marketMeta, index) => {
        const res = await axios.get(
          "https://public.coindcx.com/market_data/candles",
          {
            params: {
              pair: marketMeta?.pair,
              interval: filters?.interval,
              limit: 50,
            },
          }
        );
        ohlc.push({
          index,
          ohlc: res?.data,
          metaData: marketMeta,
        });
      });
      await Promise.all(responses);
      ohlc = ohlc.sort((a, b) => (a.index > b.index ? 1 : -1));
      setCandleData(ohlc);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  function onSelectChange(key, value) {
    setFilters({
      ...filters,
      [key]: value,
    });
  }

  function onSearchClick() {
    setAppliedFilters(filters);
    getOHLC();
  }

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card className="gx-card" title="Growth Analysis">
            <Spin spinning={loading}>
              <div className="mt-n2 mb-2">
                <Form layout="inline">
                  <Form.Item label="Interval" name="interval">
                    <Select
                      defaultValue={"2h"}
                      value={filters?.interval}
                      onChange={(value) => onSelectChange("interval", value)}
                    >
                      <Option value="1m">1m</Option>
                      <Option value="5m">5m</Option>
                      <Option value="15m">15m</Option>
                      <Option value="30m">30m</Option>
                      <Option value="1h">1h</Option>
                      <Option value="2h">2h</Option>
                      <Option value="4h">4h</Option>
                      <Option value="6h">6h</Option>
                      <Option value="8h">8h</Option>
                      <Option value="1d">1d</Option>
                      <Option value="3d">3d</Option>
                      <Option value="1W">1w</Option>
                      <Option value="1W">1M</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Category" name="category">
                    <Select
                      defaultValue={"Favorite"}
                      value={filters?.interval}
                      onChange={(value) => onSelectChange("interval", value)}
                    >
                      <Option value="Favorite">Favorite</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={onSearchClick}
                      type="primary"
                      htmlType="submit"
                    >
                      Search
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <Row>
                {candleData?.map((candleData, i) => {
                  const data = candleData?.ohlc
                    ?.sort((a, b) => (a.time < b.time ? -1 : 1))
                    ?.map((a) => ({ ...a, date: new Date(a.time) }));
                  return (
                    <Col key={i} xs={24} sm={24} md={8}>
                      <div>
                        <h4>{candleData?.metaData?.pair}</h4>
                        <CandleStickChart
                          duration={appliedFilters?.interval}
                          data={data || []}
                        />
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    marketMetaDetails: state.marketMetaDetails,
  };
};

export default connect(mapStateToProps)(MarketWatch);
