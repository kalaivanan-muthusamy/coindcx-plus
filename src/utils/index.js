import { roundOff } from './number-format';

export function massagePriceChangesData(allCoinsPrices, marketDetails, coinsCurrentPrice) {
    let dataByCoin = {};
    const allCoins = marketDetails.map(market => market.coindcx_name);
    console.log({ allCoins });
    Object.keys(allCoinsPrices).map((key) => {
        const coinMetaArray = key.split("_");
        const coin = coinMetaArray[0];
        if (!allCoins.includes(coin)) return false;
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

    console.log({ dataByCoin })


    const metrics = Object.values(dataByCoin);
    const allCoinDetails = {};
    metrics
        .map((metric, index) => {
            const coinDetails = marketDetails?.find(
                (marketInfo) => marketInfo.coindcx_name === metric.coinName
            );
            if (!metric) return null;
            if (!coinDetails) return null;
            const modifiedData = {
                sno: index + 1,
                coinDCXName: coinDetails?.coindcx_name,
                displayName: coinDetails?.target_currency_short_name  + "_" + coinDetails?.base_currency_short_name,
                symbol: coinDetails?.target_currency_short_name,
                name: coinDetails?.target_currency_name,
                priceValue: coinsCurrentPrice?.[metric?.coinName],
                highValue: metric?.high,
                lowValue: metric?.low,
                volume: new Intl.NumberFormat('en-IN').format(metric?.vol),
                percentageChangeValue: metric?.percent,
                price: roundOff(coinsCurrentPrice?.[metric?.coinName], coinDetails?.base_currency_precision) + ' ' + coinDetails?.base_currency_short_name,
                high: roundOff(metric?.high, coinDetails?.base_currency_precision) + ' ' + coinDetails?.base_currency_short_name,
                low: roundOff(metric?.low, coinDetails?.base_currency_precision) + ' ' + coinDetails?.base_currency_short_name,
            };
            allCoinDetails[metric.coinName] = modifiedData;
        })
    return allCoinDetails
}
