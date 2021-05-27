import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

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
    title: "High-Low Diff",
    dataIndex: "highLowDiff",
    key: "highLowDiff",
  },
  {
    title: "Open-Close Diff",
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

function HistoricalDataCoinDCX({ coinDetails }) {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    getHistoricalData();
  }, []);

  async function getHistoricalData() {
    try {
      const { data: ohlcData } = await axios.get(
        `https://public.coindcx.com/market_data/candles`,
        {
          params: {
            pair: `I-${coinDetails?.symbol?.toUpperCase()}_INR`,
            startTime: new Date().setDate(new Date().getDate() - 31),
            endTime: Date.now(),
            interval: "1d",
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

  return <Table dataSource={historicalData} columns={columns} />;
}

export default HistoricalDataCoinDCX;
