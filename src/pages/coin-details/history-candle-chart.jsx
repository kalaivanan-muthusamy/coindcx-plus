import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { updateHistoryData } from "./util/index";

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

function HistoryCandleChart({ coinDetails }) {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    getHistoricalData();
  }, [coinDetails]);

  async function getHistoricalData() {
    try {
      const { data: ohlcData } = await axios.get(
        `https://public.coindcx.com/market_data/candles`,
        {
          params: {
            pair: `${coinDetails?.pair}`,
            startTime: moment().add(-31, "d").format("x"),
            endTime: moment().format("x"),
            interval: "1d",
          },
        }
      );
      setHistoricalData(getCandleData(updateHistoryData(ohlcData)));
    } catch (err) {
      console.error(err);
    }
  }

  function getCandleData(data) {
    return data?.map((d) => ({
      x: new Date(d?.time),
      y: [d.openValue, d.highValue, d.lowValue, d.closeValue],
    }));
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={[{ data: historicalData }]}
        type="candlestick"
        height={300}
      />
    </div>
  );
}

export default HistoryCandleChart;
