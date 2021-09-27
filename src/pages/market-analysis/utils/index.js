// Assumption: ohlcData is already sorted
export function getGrowthRate(ohlcData) {
    const openPrice = ohlcData[0].open;
    const closePrice = ohlcData[ohlcData?.length - 1].close;
    return (closePrice - openPrice) / openPrice * 100
}