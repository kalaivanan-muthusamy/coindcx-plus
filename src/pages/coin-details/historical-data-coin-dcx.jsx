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
import { updateHistoryData } from "./util/index";

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "S.N",
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
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxOpen === record?.openValue
          ? "high-indicator"
          : record?.maxMinData?.minOpen === record?.openValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          <span className={className}>{text}</span>
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "Close",
    dataIndex: "close",
    key: "close",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxClose === record?.closeValue
          ? "high-indicator"
          : record?.maxMinData?.minClose === record?.closeValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          <span className={className}>{text}</span>
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "High",
    dataIndex: "high",
    key: "high",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxHigh === record?.highValue
          ? "high-indicator"
          : record?.maxMinData?.minHigh === record?.highValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          <span className={className}>{text}</span>
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "Low",
    dataIndex: "low",
    key: "low",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxLow === record?.lowValue
          ? "high-indicator"
          : record?.maxMinData?.minLow === record?.lowValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          <span className={className}>{text}</span>
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "HL Diff",
    dataIndex: "highLowDiff",
    key: "highLowDiff",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxHLDiff === record?.highLowDiffValue
          ? "high-indicator"
          : record?.maxMinData?.minHLDiff === record?.highLowDiffValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          <span className={className}>{text}</span>
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "OH Diff",
    dataIndex: "openHighDiff",
    key: "openHighDiff",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxOHDiff === record?.openHighDiffValue
          ? "high-indicator"
          : record?.maxMinData?.minOHDiff === record?.openHighDiffValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          {record?.highValue > record?.openValue ? (
            <span className={`${className} text-nowrap text-success`}>
              +{text}
            </span>
          ) : (
            <span className={`${className} text-nowrap text-danger`}>
              {text}
            </span>
          )}
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "OC Diff",
    dataIndex: "openCloseDiff",
    key: "openCloseDiff",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxOCDiff === record?.openCloseDiffValue
          ? "high-indicator"
          : record?.maxMinData?.minOCDiff === record?.openCloseDiffValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          {record?.closeValue > record?.openValue ? (
            <span className={`${className} text-nowrap text-success`}>
              +{text}
            </span>
          ) : (
            <span className={`${className} text-nowrap text-danger`}>
              {text}
            </span>
          )}
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "LC Diff",
    dataIndex: "lowCloseDiff",
    key: "lowCloseDiff",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxLCDiff === record?.lowCloseDiffValue
          ? "high-indicator"
          : record?.maxMinData?.minLCDiff === record?.lowCloseDiffValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          {record?.closeValue > record?.lowValue ? (
            <span className={`${className} text-nowrap text-success`}>
              +{text}
            </span>
          ) : (
            <span className={`${className} text-nowrap text-danger`}>
              {text}
            </span>
          )}
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
  {
    title: "Volume",
    dataIndex: "volume",
    key: "volume",
    render: (text, record) => {
      const className =
        record?.maxMinData?.maxVolume === record?.volumeValue
          ? "high-indicator"
          : record?.maxMinData?.minVolume === record?.volumeValue
          ? "low-indicator"
          : "";
      return (
        <div className="high-low-indicator">
          <span className={className}>{text}</span>
          <span className={"high-low-indicator-bg " + className + "-bg"}></span>
        </div>
      );
    },
  },
];

const intervalIds = [];

function HistoricalDataCoinDCX({ coinDetails }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInterval, setDataInterval] = useState("1d");
  const [startTime, setStartTime] = useState(moment().add(-10, "d"));
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
      // unmount needed when coinDetails is changed
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
          {intervalsList?.map((a) => (
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
              columns={columns}
            />
          </div>
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
