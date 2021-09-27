import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Select, Table } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { historicalDataColumns, updateHistoryData } from "./util/index";
import { INTERVALS_LIST } from "./../../constants/index";
import { serviceCall } from "../../utils/api-call";
import { dateFormatter } from './../../utils/data';

const { Option } = Select;
const { RangePicker } = DatePicker;

const intervalIds = [];

function HistoricalDataCoinDCX({ coinDetails }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [volumeTrendData, setVolumeTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInterval, setDataInterval] = useState("1d");
  const [startTime, setStartTime] = useState(moment().add(-10, "d"));
  const [endTime, setEndTime] = useState(moment());

  useEffect(() => {
    loadInitial();
    return () => {
      // unmount needed when coinDetails is changed
      intervalIds?.map((id) => clearInterval(id));
    };
  }, [coinDetails, dataInterval, startTime, endTime]);

  async function loadInitial() {
    intervalIds?.map((id) => clearInterval(id));
    setLoading(true);
    await getHistoricalData();
    await getVolumeTrendData();
    setLoading(false);
    const id = setInterval(() => {
      getHistoricalData();
    }, 4000);
    intervalIds.push(id);
  }

  async function getHistoricalData() {
    try {
      const { data: ohlcData } = await axios.get(
        `https://public.coindcx.com/market_data/candles`,
        {
          params: {
            pair: `${coinDetails?.pair}`,
            startTime: startTime.startOf("day").format("x"),
            endTime: endTime.endOf("day").format("x"),
            interval: dataInterval,
          },
        }
      );
      setHistoricalData(updateHistoryData(ohlcData));
    } catch (err) {
      console.error(err);
    }
  }

  async function getVolumeTrendData() {
    try {
      const { data } = await serviceCall(
        "GET",
        `candles/volume-trend/${coinDetails?.pair}`
      );
      setVolumeTrendData(data);
    } catch (err) {
      console.error(err);
    }
  }

  function onIntervalChange(val) {
    setDataInterval(val);
  }

  function onDateRangeChange([startTime, endTime]) {
    setStartTime(startTime);
    setEndTime(endTime);
  }

  return (
    <div className="row">
      <div className="col-sm-12 mr-auto">
        <Select
          className="me-2 mt-1"
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
          className="me-2 mt-1"
        />
      </div>
      <div className="col-md-12 mt-4">
        <Card className="gx-card" title="Historical Data">
          <div className="gx-table-responsive">
            <Table
              scroll={{ x: "100%" }}
              size="small"
              loading={loading}
              dataSource={historicalData}
              columns={historicalDataColumns(dataInterval)}
            />
          </div>
        </Card>
      </div>

      <div className="col-sm-12">
        <Card className="gx-card" title="Volume Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              data={volumeTrendData}
            >
              <Line
                name="Volume"
                type="monotone"
                dataKey="volume"
                stroke="#bbb"
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="dateTime" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="col-sm-12">
        <Card className="gx-card" title="High - Low Difference">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              data={historicalData?.slice()?.reverse?.()}
            >
              <Line
                name="High Low Diff"
                type="monotone"
                dataKey="highLowDiffValue"
                stroke="#8884d8"
              />
              <Line
                name="Open Close Diff"
                type="monotone"
                dataKey="openCloseDiffValue"
                stroke="#bbb"
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

export default HistoricalDataCoinDCX;
