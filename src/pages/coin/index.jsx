import Title from "antd/lib/typography/Title";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import HistoricalData from "./historical-data";
import HistoricalDataCoinDCX from "./historical-data-coin-dcx";
import OrderBook from "./order-book";

const { TabPane } = Tabs;

function Coin() {
  const [allCoins, setAllCoins] = useState(null);
  const [activeCoin, setActiveCoin] = useState(null);
  const { coinSymbol } = useParams();

  useEffect(() => {
    getFullDetails();
  }, []);

  useEffect(() => {
    if (allCoins) {
      const match = allCoins?.find(
        (coin) => coin.symbol === coinSymbol.toLowerCase()
      );
      if (match) setActiveCoin(match);
    }
  }, [allCoins]);

  useEffect(() => {
    if (activeCoin) {
      getCoinDetails();
    }
  }, [activeCoin]);

  async function getCoinDetails() {}

  async function getFullDetails() {
    try {
      const { data: allCoinsData } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR"
      );
      setAllCoins(allCoinsData);
    } catch (err) {
      console.error(err);
    }
  }

  function onTabChange() {}

  return (
    <>
      {/* Coin Details Header */}
      {activeCoin && (
        <div>
          <Title>
            {activeCoin?.name}{" "}
            <span className="h5 d-inline text-secondary" level={5}>
              ({activeCoin?.symbol?.toUpperCase()})
            </span>
          </Title>
          <Tabs defaultActiveKey="1" onChange={onTabChange}>
            <TabPane tab="Historical Data (CoinDCX)" key="1">
              <HistoricalDataCoinDCX coinDetails={activeCoin} />
            </TabPane>
            <TabPane tab="Historical Data" key="2">
              <HistoricalData coinId={activeCoin?.id} />
            </TabPane>
            <TabPane tab="Order Book" key="3">
              <OrderBook coinDetails={activeCoin} />
            </TabPane>
          </Tabs>
        </div>
      )}
    </>
  );
}

export default Coin;
