import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { updateHistoryData } from "./util/index";
import moment from "moment";

function TradeChart(props) {
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
            pair: `${props?.coinPair}`,
            startTime: moment().add(-10, "d").valueOf(),
            endTime: moment().valueOf(),
            interval: "1d",
          },
        }
      );
      setHistoricalData(updateHistoryData(ohlcData));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="gx-site-dash gx-pr-xl-5 gx-pt-3 gx-pt-xl-0 gx-pt-xl-2">
      <h6 className="gx-text-uppercase gx-mb-2 gx-mb-xl-4">Site Visits</h6>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart
          data={historicalData?.slice()?.reverse()}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <Tooltip />
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Line
            name="Open Value"
            type="monotone"
            dataKey="openValue"
            fillOpacity={1}
            stroke="#038FDE"
            fill="#038FDE"
          />
          <Line
            name="Close Value"
            type="monotone"
            dataKey="closeValue"
            fillOpacity={1}
            stroke="#FE9E15"
            fill="#FE9E15"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedCoin: state.selectedCoin,
    coinPair: state.coinPair,
  };
};

export default connect(mapStateToProps)(TradeChart);
