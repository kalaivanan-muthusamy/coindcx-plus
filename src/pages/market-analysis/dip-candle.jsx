import React, { useEffect, useState } from "react";
import { Col, Spin } from "antd";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const options = {
  chart: {
    type: "candlestick",
    height: 350,
    zoom: {
      type: "xy",
      autoScaleYaxis: true,
    },
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: "#389e0d",
        downward: "#f5222d",
      },
    },
  },
  title: {
    text: "",
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
};

function DipCandle({ marketPair, interval, candlesCount }) {
  const [loading, setLoading] = useState(false);
  const [candleData, setCandleData] = useState([]);

  useEffect(() => {
    console.log("here");
    getMarketData();
  }, [marketPair]);

  async function getMarketData() {
    setLoading(true);
    try {
      const { data: ohlcData } = await axios.get(
        `https://public.coindcx.com/market_data/candles`,
        {
          params: {
            pair: marketPair,
            interval,
            limit: parseInt(candlesCount) + 10,
          },
        }
      );
      setCandleData(getCandleData(ohlcData));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function getCandleData(data) {
    return data?.map((d) => ({
      x: new Date(d?.time),
      y: [d.open, d.high, d.low, d.close],
    }));
  }

  return (
    <Col xs={24} sm={24} md={6}>
      <Spin spinning={loading}>
        <h4>{marketPair}</h4>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={[{ data: candleData }]}
            type="candlestick"
            height={300}
          />
        </div>
      </Spin>
    </Col>
  );
}

export default DipCandle;
