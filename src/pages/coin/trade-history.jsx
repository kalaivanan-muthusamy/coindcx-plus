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
    title: "Date & Time",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Trade Price",
    dataIndex: "tradePrice",
    key: "tradePrice",
    render: (text, record) =>
      record?.marketMaker ? (
        <span className="text-danger">-{text}</span>
      ) : (
        <span className="text-success">+{text}</span>
      ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
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
];

const intervalIds = [];

function TradeHistory({ coinDetails }) {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitial();
    return () => {
      intervalIds?.map((id) => clearInterval(id));
    };
  }, [coinDetails]);

  async function loadInitial() {
    setLoading(true);
    await getTradeHistory();
    setLoading(false);
    const id = setInterval(() => {
      getTradeHistory();
    }, 4000);
    intervalIds.push(id);
  }

  async function getTradeHistory() {
    try {
      const { data: tradeHistoryData } = await axios.get(
        `https://public.coindcx.com/market_data/trade_history`,
        {
          params: {
            pair: coinDetails?.pair,
            limit: 500,
          },
        }
      );
      setTradeHistory(
        tradeHistoryData?.map((history, ind) => ({
          sno: ind + 1,
          tradePriceValue: history?.p,
          quantity: history?.q,
          date: new Intl.DateTimeFormat("en-IN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(history?.T),
          marketMaker: history?.m,
          tradePrice: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(history?.p),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Table loading={loading} dataSource={tradeHistory} columns={columns} />
  );
}

export default TradeHistory;
