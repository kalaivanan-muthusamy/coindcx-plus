import { Card, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { coinsColumns } from "./utils";

function Coins(props) {
  const [loading, setLoading] = useState();
  const [allCoins, setAllCoins] = useState([]);

  useEffect(() => {
    getPriceChanges();
    const id = setInterval(() => {
      getPriceChanges();
    }, 4000);
    return () => {
      clearInterval(id);
    };
  }, []);

  async function getPriceChanges() {
    try {
      const { data: allCoinsPrices } = await axios.get(
        `https://public.coindcx.com/market_data/price_changes`
      );
      setAllCoins(massagePriceRes(allCoinsPrices));
    } catch (err) {
      console.error(err);
    }
  }

  function massagePriceRes(allCoinsPrices) {
    const dataByCoin = {};
    Object.keys(allCoinsPrices).map((key) => {
      const coinMetaArray = key.split("_");
      const coin = coinMetaArray[0];
      if (!coin.endsWith("INR")) return false;
      const metric = coinMetaArray[1];
      if (dataByCoin[coin]) {
        dataByCoin[coin] = {
          ...dataByCoin[coin],
          [metric]: allCoinsPrices[key],
        };
      } else {
        dataByCoin[coin] = { coinName: coin, [metric]: allCoinsPrices[key] };
      }
    });
    const metrics = Object.values(dataByCoin);
    return metrics
      .map((metric, index) => {
        const coinDetails = props?.marketDetails?.find(
          (marketInfo) => marketInfo.coindcx_name === metric.coinName
        );
        if (!coinDetails) return null;
        return {
          ...metric,
          sno: index + 1,
          symbol: coinDetails?.target_currency_short_name,
          name: coinDetails?.target_currency_name,
          priceValue: props?.coinsCurrentPrice?.[metric?.coinName],
          highValue: metric?.high,
          lowValue: metric?.low,
          percentageChangeValue: metric?.percent,
          price: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(props?.coinsCurrentPrice?.[metric?.coinName]),
          high: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(metric?.high),
          low: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(metric?.low),
        };
      })
      .filter((metric) => metric !== null);
  }

  return (
    <Card className="gx-card">
      <div className="gx-table-responsive">
        <Table
          size="small"
          scroll={{ x: "100%" }}
          loading={props?.marketDetails ? false : true}
          dataSource={allCoins}
          columns={coinsColumns}
        />
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    coinsCurrentPrice: state.coinsCurrentPrice,
    marketDetails: state.marketDetails,
  };
};

export default connect(mapStateToProps)(Coins);
