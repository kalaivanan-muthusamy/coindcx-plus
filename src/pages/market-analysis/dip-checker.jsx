import React, { useState } from "react";
import { Card, Col, Row, Select, Form, Button } from "antd";
import { Spin } from "antd";
import { INR_MARKETS, USDT_MARKETS } from "./../../constants/index";
import axios from "axios";
import DipCandle from "./dip-candle";

const { Option } = Select;

function DipChecker() {
  const [formInputs, setFormInputs] = useState({
    interval: "1d",
    candlesCount: 3,
  });
  const [allMarketData, setAllMarketData] = useState({});
  const [dipMarkets, setDipMarkets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getBaseCandleData() {
    setLoading(true);
    const allMarketData = {};
    const allPromise = [...USDT_MARKETS, ...INR_MARKETS].map(
      async (marketPair) => {
        const { data } = await axios.get(
          "https://public.coindcx.com/market_data/candles",
          {
            params: {
              pair: marketPair,
              interval: formInputs?.interval,
              limit: formInputs?.candlesCount,
            },
          }
        );
        allMarketData[marketPair] = data;
      }
    );
    await Promise.all(allPromise);
    setAllMarketData(allMarketData);

    // Identify market with given red candles count
    const dipMarkets = [];
    Object.keys(allMarketData).map((marketPair) => {
      const marketData = allMarketData[marketPair];
      const rendCandleCounts = marketData.filter((d) => d.close < d.open);
      if (rendCandleCounts.length === marketData.length)
        dipMarkets.push(marketPair);
    });
    setDipMarkets(dipMarkets);
    setLoading(false);
  }

  function onSearchClick() {
    getBaseCandleData();
  }

  function onSelectChange(key, value) {
    setFormInputs({
      ...formInputs,
      [key]: value,
    });
  }

  return (
    <Card className="gx-card" title="Candle Dip Analysis">
      <div className="mt-n2 mb-3">
        <Spin spinning={loading}>
          <Row>
            <Col xs={24}>
              <Form layout="inline">
                <Form.Item style={{ flex: 1 }} label="Interval" name="interval">
                  <Select
                    defaultValue={formInputs?.interval}
                    value={formInputs?.interval}
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
                    <Option value="1W">1W</Option>
                    <Option value="1W">1M</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ flex: 1 }}
                  label="Candles Count"
                  name="candlesCount"
                >
                  <Select
                    defaultValue={formInputs?.candlesCount}
                    value={formInputs?.candlesCount}
                    onChange={(value) => onSelectChange("candlesCount", value)}
                  >
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="7">7</Option>
                    <Option value="8">8</Option>
                    <Option value="9">9</Option>
                    <Option value="10">10</Option>
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
            </Col>
          </Row>
          <Row>
            {dipMarkets?.length > 0 &&
              dipMarkets?.map((marketPair) => (
                <DipCandle
                  interval={formInputs?.interval}
                  candlesCount={formInputs?.candlesCount}
                  key={marketPair}
                  marketPair={marketPair}
                />
              ))}
          </Row>
        </Spin>
      </div>
    </Card>
  );
}

export default DipChecker;
