import { Card, Row, Col, Select, Form, DatePicker, Button, Spin } from "antd";
import { useState } from "react";
import moment from "moment";
import axios from "axios";
import ReactJson from "react-json-view";
import {
  BNB_MARKETS,
  INR_MARKETS,
  USDT_MARKETS,
} from "./../../constants/index";

const { Option } = Select;
const { RangePicker } = DatePicker;

const defaultStartTime = moment().add(-1, "months").startOf("day");
const defaultEndTime = moment().endOf("day");

function StrategyTester() {
  const [formInputs, setFormInputs] = useState({
    interval: "1d",
    buyTarget: 2,
    startTime: defaultStartTime,
    endTime: defaultEndTime,
  });
  const [testResponse, setTestResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [targetURL, setTargetURL] = useState(null);

  function onSelectChange(key, value) {
    let additionalUpdate = {};
    if (key === "marketCurrency") {
      let markets = [];
      if (value.includes("INR")) markets = [...markets, ...INR_MARKETS];
      if (value.includes("USDT")) markets = [...markets, ...USDT_MARKETS];
      if (value.includes("BNB")) markets = [...markets, ...BNB_MARKETS];
      additionalUpdate.currencyPair = markets;
    }
    setFormInputs({
      ...formInputs,
      ...additionalUpdate,
      [key]: value,
    });
  }

  function onDateRangeChange([startTime, endTime]) {
    setFormInputs({
      ...formInputs,
      startTime,
      endTime,
    });
  }

  function getCurrencyPairOptions() {
    const allPairs = [...INR_MARKETS, ...USDT_MARKETS, ...BNB_MARKETS];
    return allPairs.map((a) => (
      <Option key={a} value={a}>
        {a}
      </Option>
    ));
  }

  async function onSubmit() {
    setLoading(true);
    try {
      const {
        data,
        request: { responseURL },
      } = await axios.get(
        "http://coinanalysis-api.herokuapp.com/strategy-tester",
        {
          params: {
            interval: formInputs?.interval,
            buyTarget: formInputs?.buyTarget,
            coins: formInputs?.currencyPair?.join?.(","),
            startTime: formInputs?.startTime?.format("DD-MM-YYYY"),
            endTime: formInputs?.endTime?.format("DD-MM-YYYY"),
          },
        }
      );
      setTestResponse(data);
      setTargetURL(responseURL);
    } catch (err) {
      setTestResponse({});
      setTargetURL(null);
    }
    setLoading(false);
  }

  return (
    <Card className="gx-card" title="Candle Strategy Tester">
      <div className="mt-n2 mb-3">
        <Spin spinning={loading}>
          <Row>
            <Col xs={24} sm={24} md={8}>
              <Form layout="vertical">
                <Form.Item label="Interval" name="interval">
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

                <Form.Item label="Buy Target" name="buyTarget">
                  <Select
                    defaultValue={formInputs?.buyTarget}
                    value={formInputs?.buyTarget}
                    onChange={(value) => onSelectChange("buyTarget", value)}
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

                <Form.Item label="Market Currency" name="marketCurrency">
                  <Select
                    allowClear
                    mode="multiple"
                    value={formInputs?.marketCurrency}
                    onChange={(value) =>
                      onSelectChange("marketCurrency", value)
                    }
                  >
                    <Option value="INR">INR</Option>
                    <Option value="USDT">USDT</Option>
                    <Option value="BNB">BNB</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Currency Pair" name="currencyPair">
                  <Select
                    allowClear
                    mode="multiple"
                    value={formInputs?.currencyPair}
                    onChange={(value) => onSelectChange("currencyPair", value)}
                  >
                    {getCurrencyPairOptions()}
                  </Select>
                </Form.Item>
                <Form.Item label="Data Range" name="dateRange">
                  <RangePicker
                    onChange={onDateRangeChange}
                    defaultValue={[formInputs?.startTime, formInputs?.endTime]}
                    className="w-100"
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button onClick={onSubmit} type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={16}
              style={{ maxHeight: "400px", overflow: "auto" }}
            >
              {targetURL && (
                <a
                  target="_blank"
                  className="d-inline-block mb-3"
                  rel="noreferrer"
                  href={targetURL}
                >
                  {targetURL}
                </a>
              )}
              <ReactJson
                displayDataTypes={false}
                collapsed={1}
                src={testResponse || {}}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </Card>
  );
}

export default StrategyTester;
