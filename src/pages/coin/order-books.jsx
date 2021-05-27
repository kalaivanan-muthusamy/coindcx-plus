import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

const bidColumns = [
  {
    title: "S.No",
    dataIndex: "sno",
    key: "sno",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text) => <span className="text-success">{text}</span>,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
];

const asksColumns = [
  {
    title: "S.No",
    dataIndex: "sno",
    key: "sno",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text) => <span className="text-danger">{text}</span>,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
];

function OrderBooks({ coinDetails }) {
  const [orderBook, setOrderBook] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      getOrderBookData();
    }, 4000);

    return () => {
      clearInterval(id);
    };
  }, []);

  async function getOrderBookData() {
    try {
      const { data: orderBookData } = await axios.get(
        `https://public.coindcx.com/market_data/orderbook`,
        {
          params: {
            pair: `I-${coinDetails?.symbol?.toUpperCase()}_INR`,
          },
        }
      );
      setOrderBook({
        bids: Object.keys(orderBookData?.bids).map((price, ind) => ({
          sno: ind + 1,
          price: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(price),
          quantity: orderBookData?.bids[price],
        })),
        asks: Object.keys(orderBookData?.asks).reverse().map((price, ind) => ({
          sno: ind + 1,
          price: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(price),
          quantity: orderBookData?.asks[price],
        })),
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="row">
      <div className="col-6">
        <Table dataSource={orderBook?.bids} columns={bidColumns} />
      </div>
      <div className="col-6">
        <Table dataSource={orderBook?.asks} columns={asksColumns} />
      </div>
    </div>
  );
}

export default OrderBooks;
