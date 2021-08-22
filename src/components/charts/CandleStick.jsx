import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay, utcMinute, utcHour, utcWeek, utcMonth } from "d3-time";
import { format } from "d3-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import {
  MouseCoordinateY,
  CrossHairCursor,
} from "react-stockcharts/lib/coordinates";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

const periodToTimeIntervalMap = {
  "1m": utcMinute,
  "5m": utcMinute.every(5),
  "15m": utcMinute.every(15),
  "30m": utcMinute.every(30),
  "1h": utcHour,
  "2h": utcHour.every(2),
  "4h": utcHour.every(4),
  "6h": utcHour.every(6),
  "8h": utcHour.every(8),
  "1d": utcDay,
  "3d": utcDay.every(3),
  "1w": utcWeek,
  "1M": utcMonth,
};

class CandleStickChart extends React.Component {
  render() {
    const { type, width, data, ratio, duration = "1d" } = this.props;
    const xAccessor = (d) => d.date;
    const xExtents = [xAccessor(last(data)), xAccessor(data[data.length - 20])];
    return (
      <ChartCanvas
        height={320}
        ratio={ratio}
        width={width}
        margin={{ left: 10, right: 70, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xAccessor={xAccessor}
        xScale={scaleTime()}
        xScaleProvider={discontinuousTimeScaleProvider}
        xExtents={xExtents}
      >
        <Chart id={1} yExtents={(d) => [d.high, d.low]}>
          <XAxis
            fontFamily="NoirPro"
            axisAt="bottom"
            orient="bottom"
            ticks={6}
          />
          <YAxis fontFamily="NoirPro" axisAt="right" orient="right" ticks={5} />
          <MouseCoordinateY
            at="right"
            orient="right"
            rectWidth={67}
            fontFamily="NoirPro"
            displayFormat={format(".2f")}
          />
          <CandlestickSeries
            opacity={0.7}
            fill={(d) => (d.close > d.open ? "#228B22" : "#FF0000")}
            stroke="#444"
            wickStroke="#777"
            clip={false}
            width={timeIntervalBarWidth(periodToTimeIntervalMap[duration])}
          />
          <OHLCTooltip fontFamily="NoirPro" origin={[0, 0]} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

CandleStickChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
  type: "svg",
};

CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
