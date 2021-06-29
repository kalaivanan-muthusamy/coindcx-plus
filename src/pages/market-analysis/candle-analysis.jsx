import { useEffect, useState } from "react";
import { Card, Table, DatePicker, Select, Button } from "antd";
import axios from "axios";
import moment from "moment";
import { INTERVALS_LIST } from "./../../constants/index";
import { candleDataColumns } from "./utils";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const defaultStartTime = moment().add(-6, "months").startOf("day");
const defaultEndTime = moment().endOf("day");

function CandleAnalysis() {
  const [dataInterval, setDataInterval] = useState("1d");
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [loadingCandleAnalysis, setLoadingCandleAnalysis] = useState(false);
  const [candleData, setCandleData] = useState([]);

  useEffect(() => {
    getCandleData();
  }, []);

  async function getCandleData() {
    setLoadingCandleAnalysis(true);
    try {
      let { data: candleDataRes } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/candle-strategy-analysis`,
        {
          params: {
            startTime: startTime.format("YYYY-MM-DD"),
            endTime: endTime.format("YYYY-MM-DD"),
            interval: dataInterval,
          },
        }
      );
      const candleDataByCoin = candleDataRes.candleData;
      const candleData = Object.keys(candleDataByCoin).map(
        (coinName, index) => ({
          ...candleDataByCoin[coinName],
          pair: coinName,
          sno: index + 1,
        })
      );
      setCandleData(candleData);
    } catch (err) {
      console.error(err);
    }
    setLoadingCandleAnalysis(false);
  }

  function onDateRangeChange([startTime, endTime]) {
    setStartTime(startTime);
    setEndTime(endTime);
  }

  function onIntervalChange(val) {
    setDataInterval(val);
  }

  function onSearch() {
    getCandleData();
  }

  return (
    <Card className="gx-card" title="Candle Analysis">
      <div className="mt-n2 mb-3">
        <Select
          className="me-2"
          defaultValue={dataInterval}
          style={{ width: 120 }}
          onChange={onIntervalChange}
        >
          {INTERVALS_LIST?.map((a) => (
            <Option key={a} value={a}>
              {a}
            </Option>
          ))}
        </Select>
        <RangePicker
          onChange={onDateRangeChange}
          defaultValue={[startTime, endTime]}
          className="me-2"
        />
        <Button
          onClick={onSearch}
          className="mb-1"
          type="primary"
          icon={<SearchOutlined />}
        >
          Search
        </Button>
      </div>
      <div className="gx-table-responsive">
        <Table
          size="small"
          scroll={{ x: "100%" }}
          loading={loadingCandleAnalysis}
          dataSource={candleData}
          columns={candleDataColumns}
        ></Table>
      </div>
    </Card>
  );
}

export default CandleAnalysis;
