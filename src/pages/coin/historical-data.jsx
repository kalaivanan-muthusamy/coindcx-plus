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
  {
    title: "Market Cap",
    dataIndex: "marketCap",
    key: "marketCap",
  },
];

function HistoricalData({ coinId }) {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    getHistoricalData();
  }, []);

  async function getHistoricalData() {
    try {
      const { data: ohlcData } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=inr&days=30`
      );
      setHistoricalData(updateHistoryData(ohlcData));
    } catch (err) {
      console.error(err);
    }
  }

  function updateHistoryData(ohlcData) {
    const groupedData = {};
    ohlcData?.reverse()?.map((data) => {
      const date = new Intl.DateTimeFormat("en-IN").format(data?.[0]);
      if (groupedData[date]) {
        const existingData = groupedData[date];
        groupedData[date] = {
          allData: [...existingData?.allData, data],
        };
      } else {
        groupedData[date] = {
          allData: [data],
        };
      }
    });
    console.log({ groupedData });

    return Object.keys(groupedData).map((date, ind) => {
      const data = groupedData[date];
      const allData = data?.allData;
      const open = allData[allData.length - 1][1];
      const close = allData[0][4];
      const high = Math.max(...allData?.map((d) => d[2]));
      const low = Math.min(...allData?.map((d) => d[3]));
      return {
        sno: ind + 1,
        date,
        openValue: open,
        highValue: high,
        lowValue: low,
        closeValue: close,
        open: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(open),
        high: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(high),
        low: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(low),
        close: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(close),
        openCloseDiff: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(close - open),
        highLowDiff: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(high - low),
      };
    });
  }

  return <Table dataSource={historicalData} columns={columns} />;
}

export default HistoricalData;
