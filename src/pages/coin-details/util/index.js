import moment from 'moment';

export function updateHistoryData(ohlcData) {
    // Identify the max and min data
    let maxMinData = {
        maxOpen: 0,
        minOpen: Infinity,
        maxClose: 0,
        minClose: Infinity,
        maxHigh: 0,
        minHigh: Infinity,
        maxLow: 0,
        minLow: Infinity,
        maxHLDiff: 0,
        minHLDiff: Infinity,
        maxOHDiff: 0,
        minOHDiff: Infinity,
        maxOCDiff: 0,
        minOCDiff: Infinity,
        maxLCDiff: 0,
        minLCDiff: Infinity,
        maxVolume: 0,
        minVolume: Infinity,
    }
    ohlcData?.map((data, ind) => {
        const highLowDiffValue = data?.high - data?.low;
        const openCloseDiffValue = data?.close - data?.open;
        const lowCloseDiffValue = data?.close - data?.low;
        const openHighDiffValue = data?.high - data?.open;

        if (data?.open > maxMinData.maxOpen) maxMinData.maxOpen = data?.open
        if (data?.open < maxMinData.minOpen) maxMinData.minOpen = data?.open
        if (data?.close > maxMinData.maxClose) maxMinData.maxClose = data?.close
        if (data?.close < maxMinData.minClose) maxMinData.minClose = data?.close
        if (data?.high > maxMinData.maxHigh) maxMinData.maxHigh = data?.high
        if (data?.high < maxMinData.minHigh) maxMinData.minHigh = data?.high
        if (data?.low > maxMinData.maxLow) maxMinData.maxLow = data?.low
        if (data?.low < maxMinData.minLow) maxMinData.minLow = data?.low
        if (highLowDiffValue > maxMinData.maxHLDiff) maxMinData.maxHLDiff = highLowDiffValue
        if (highLowDiffValue < maxMinData.minHLDiff) maxMinData.minHLDiff = highLowDiffValue
        if (openHighDiffValue > maxMinData.maxOHDiff) maxMinData.maxOHDiff = openHighDiffValue
        if (openHighDiffValue < maxMinData.minOHDiff) maxMinData.minOHDiff = openHighDiffValue
        if (openCloseDiffValue > maxMinData.maxOCDiff) maxMinData.maxOCDiff = openCloseDiffValue
        if (openCloseDiffValue < maxMinData.minOCDiff) maxMinData.minOCDiff = openCloseDiffValue
        if (lowCloseDiffValue > maxMinData.maxLCDiff) maxMinData.maxLCDiff = lowCloseDiffValue
        if (lowCloseDiffValue < maxMinData.minLCDiff) maxMinData.minLCDiff = lowCloseDiffValue
        if (data?.volume > maxMinData.maxVolume) maxMinData.maxVolume = data?.volume
        if (data?.volume < maxMinData.minVolume) maxMinData.minVolume = data?.volume
    })

    return ohlcData?.map((data, ind) => ({
        maxMinData,
        sno: ind + 1,
        time: data?.time,
        date: new Intl.DateTimeFormat("en-IN").format(data?.time),
        formattedDate: moment(data?.time).format('YYYY-MM-DD'),
        openValue: data?.open,
        highValue: data?.high,
        lowValue: data?.low,
        closeValue: data?.close,
        highLowDiffValue: data?.high - data?.low,
        openCloseDiffValue: data?.close - data?.open,
        lowCloseDiffValue: data?.close - data?.low,
        openHighDiffValue: data?.high - data?.open,
        volumeValue: data?.volume,
        volume: new Intl.NumberFormat("en-IN").format(data?.volume),
        open: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.open),
        high: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.high),
        low: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.low),
        close: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.close),
        openCloseDiff: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.close - data?.open),
        lowCloseDiff: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.close - data?.low),
        highLowDiff: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.high - data?.low),
        openHighDiff: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(data?.high - data?.open),
    }));
}