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

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "S.No",
    dataIndex: "sno",
    key: "sno",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Open",
    dataIndex: "open",
    key: "open",
  },
  {
    title: "Close",
    dataIndex: "close",
    key: "close",
  },
  {
    title: "High",
    dataIndex: "high",
    key: "high",
  },
  {
    title: "Low",
    dataIndex: "low",
    key: "low",
  },
  {
    title: "HL Diff",
    dataIndex: "highLowDiff",
    key: "highLowDiff",
  },
  {
    title: "OC Diff",
    dataIndex: "openCloseDiff",
    key: "openCloseDiff",
    render: (text, record) =>
      record?.closeValue > record?.openValue ? (
        <span className="text-success">+{text}</span>
      ) : (
        <span className="text-danger">{text}</span>
      ),
  },
  {
    title: "Volume",
    dataIndex: "volume",
    key: "volume",
  },
];

const intervalIds = [];

function HistoricalDataCoinDCX({ coinDetails }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInterval, setDataInterval] = useState("1d");
  const [startTime, setStartTime] = useState(moment().add(-31, "d"));
  const [endTime, setEndTime] = useState(moment());

  const intervalsList = [
    "1m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "6h",
    "8h",
    "1d",
    "3d",
    "1w",
    "1M",
  ];

  useEffect(() => {
    loadInitial();
    return () => {
      intervalIds?.map((id) => clearInterval(id));
    };
  }, [coinDetails, dataInterval, startTime, endTime]);

  async function loadInitial() {
    intervalIds?.map((id) => clearInterval(id));
    setLoading(true);
    await getHistoricalData();
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
            startTime: startTime.format("x"),
            endTime: endTime.format("x"),
            interval: dataInterval,
          },
        }
      );
      setHistoricalData(updateHistoryData(ohlcData));
    } catch (err) {
      console.error(err);
    }
  }

  function updateHistoryData(ohlcData) {
    return ohlcData?.map((data, ind) => ({
      sno: ind + 1,
      date: new Intl.DateTimeFormat("en-IN").format(data?.time),
      openValue: data?.open,
      highValue: data?.high,
      lowValue: data?.low,
      closeValue: data?.close,
      highLowDiffValue: data?.high - data?.low,
      volume: new Intl.NumberFormat("en-IN").format(data?.volume),
      open: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.open),
      high: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.high),
      low: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.low),
      close: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.close),
      openCloseDiff: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.close - data?.open),
      highLowDiff: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(data?.high - data?.low),
    }));
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
          className="me-2"
          defaultValue={dataInterval}
          style={{ width: 120 }}
          onChange={onIntervalChange}
        >
          {intervalsList?.map((a) => (
            <Option value={a}>{a}</Option>
          ))}
        </Select>
        <RangePicker
          onChange={onDateRangeChange}
          defaultValue={[startTime, endTime]}
          className="me-2"
        />
      </div>
      <div className="col-md-8 mt-4">
        <Card title="Historical Data">
          <Table
            size="small"
            loading={loading}
            dataSource={historicalData}
            columns={columns}
          />
        </Card>
      </div>
      <div className="col-md-4 mt-4">
        <Card title="Data Points">
          <h4></h4>
        </Card>
      </div>
      <div className="col-sm-12 mt-3 ">
        <Card title="High - Low Difference">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData?.slice()?.reverse?.()}>
              <Line
                name="High Low Diff"
                type="monotone"
                dataKey="highLowDiffValue"
                stroke="#8884d8"
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
