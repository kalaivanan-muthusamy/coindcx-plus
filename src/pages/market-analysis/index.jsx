import { useEffect, useState } from "react";
import { Card, Col, Row, Table, DatePicker } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { getGrowthRate, growthDataColumns } from "./utils/index";
import { formatCurrency } from "../../utils/number-format";
import { formatNumber } from "./../../utils/number-format";

const { RangePicker } = DatePicker;

function MarketAnalysis(props) {
  const [growthData, setGrowthData] = useState([]);
  const [ohlcData, setOHLCData] = useState({});
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(moment().add(-3, "d"));
  const [endTime, setEndTime] = useState(moment());

  useEffect(() => {
    getOHLCData(startTime, endTime);
  }, []);

  useEffect(() => {
    if (Object.keys(ohlcData)?.length > 0) {
      calculateGrowthData();
    }
  }, [ohlcData]);

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
      const growthData = Object.keys(ohlcData)?.map((coinName, index) => {
        const ohlc = ohlcData[coinName];
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
      console.log({ growthData });
      setGrowthData(growthData);
    } catch (err) {
      console.error(err);
    }
  }

  function onDateRangeChange([startTime, endTime]) {
    setStartTime(startTime);
    setEndTime(endTime);
    getOHLCData(startTime, endTime);
  }

  return (
    <Row>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Card
          className="gx-card"
          title="Growth Analysis"
          extra={
            <RangePicker
              onChange={onDateRangeChange}
              defaultValue={[startTime, endTime]}
              className="me-2 mt-1"
            />
          }
        >
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
