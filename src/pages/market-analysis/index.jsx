import { useEffect, useState } from "react";
import { Card, Col, Row, Table, DatePicker } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { getGrowthRate, growthDataColumns } from "./utils/index";
import { formatCurrency } from "../../utils/number-format";
import { formatNumber } from "./../../utils/number-format";
import CandleAnalysis from "./candle-analysis";
import StrategyTester from './strategy-tester';

const { RangePicker } = DatePicker;

function MarketAnalysis(props) {
  const [growthData, setGrowthData] = useState([]);
  const [ohlcData, setOHLCData] = useState({});
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(moment().add(-3, "d"));
  const [endTime, setEndTime] = useState(moment());
  const today = moment();

  useEffect(() => {
    getOHLCData(startTime, endTime);
  }, []);

  useEffect(() => {
    if (
      Object.keys(ohlcData)?.length > 0 &&
      Object.keys(props?.coinsCurrentPrice).length > 0
    ) {
      calculateGrowthData();
    }
  }, [ohlcData, props?.coinsCurrentPrice]);

  async function getOHLCData(startTime, endTime) {
    setLoading(true);
    try {
      const { data: ohlcData } = await axios.get(
        "https://coinanalysis-api.netlify.app/.netlify/functions/get_ohlc",
        {
          params: {
            from: startTime.format("YYYY-MM-DD"),
            to: endTime.format("YYYY-MM-DD"),
          },
        }
      );
      setOHLCData(ohlcData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function calculateGrowthData() {
    try {
      let ohlcDataClone = { ...ohlcData };
      if (endTime.diff(today, "d") === 0) {
        ohlcDataClone = updateTodayClosePrice(ohlcDataClone);
      }
      const growthData = Object.keys(ohlcDataClone)?.map((coinName, index) => {
        const ohlc = ohlcDataClone[coinName];
        const growthRate = getGrowthRate(ohlc);
        const coinDetails = props?.marketDetails?.find(
          (coin) => coin.coindcx_name === coinName
        );
        return {
          sno: index + 1,
          name: coinDetails?.target_currency_name,
          coinDCXName: coinDetails?.coindcx_name,
          symbol: coinDetails?.target_currency_short_name,
          growth: formatNumber(growthRate),
          open: formatCurrency(ohlc?.[0].open),
          openValue: ohlc?.[0].open,
          close: formatCurrency(ohlc?.[ohlc?.length - 1]?.close),
          closeValue: ohlc?.[ohlc?.length - 1]?.close,
          growthValue: growthRate,
        };
      });
      setGrowthData(growthData);
    } catch (err) {
      console.error(err);
    }
  }

  function updateTodayClosePrice(ohlcData) {
    const updatedOHLCData = {};
    Object.keys(ohlcData)?.map((coinName) => {
      const ohlc = [...ohlcData[coinName]];
      const todayOHLCIndex = ohlc.findIndex(
        (d) => d.date === today.format("YYYY-MM-DD")
      );
      if (todayOHLCIndex >= 0) {
        let todayOHLC = ohlc[todayOHLCIndex];
        todayOHLC = { ...todayOHLC };
        todayOHLC.close = parseFloat(props?.coinsCurrentPrice?.[coinName]);
        ohlc.splice(todayOHLCIndex, 1, todayOHLC);
      }
      updatedOHLCData[coinName] = ohlc;
    });
    return updatedOHLCData;
  }

  function onDateRangeChange([startTime, endTime]) {
    setStartTime(startTime);
    setEndTime(endTime);
    getOHLCData(startTime, endTime);
  }

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card className="gx-card" title="Growth Analysis">
            <div className="mt-n2 mb-2">
              <RangePicker
                onChange={onDateRangeChange}
                defaultValue={[startTime, endTime]}
                className="me-2 mt-1 mb-2"
              />
            </div>
            <div className="gx-table-responsive">
              <Table
                size="small"
                scroll={{ x: "100%" }}
                loading={loading}
                dataSource={growthData}
                columns={growthDataColumns}
              ></Table>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <CandleAnalysis />
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <StrategyTester />
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    coinsCurrentPrice: state.coinsCurrentPrice,
    marketDetails: state.marketDetails,
    coinsPriceChanges: state.coinsPriceChanges,
  };
};

export default connect(mapStateToProps)(MarketAnalysis);
