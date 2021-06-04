export function massagePriceChangesData(allCoinsPrices, marketDetails, coinsCurrentPrice) {
    let dataByCoin = {};
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
    metrics
        .map((metric, index) => {
            const coinDetails = marketDetails?.find(
                (marketInfo) => marketInfo.coindcx_name === metric.coinName
            );
            if (!metric) return;
            if (!coinDetails) return;
            const modifiedData = {
                sno: index + 1,
                coinDCXName: coinDetails?.coindcx_name,
                symbol: coinDetails?.target_currency_short_name,
                name: coinDetails?.target_currency_name,
                priceValue: coinsCurrentPrice?.[metric?.coinName],
                highValue: metric?.high,
                lowValue: metric?.low,
                volume: new Intl.NumberFormat('en-IN').format(metric?.vol),
                percentageChangeValue: metric?.percent,
                price: new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(coinsCurrentPrice?.[metric?.coinName]),
                high: new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(metric?.high),
                low: new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(metric?.low),
            };
            dataByCoin[metric.coinName] = modifiedData;
        })
    return dataByCoin
}
