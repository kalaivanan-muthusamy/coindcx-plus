
export function updateHistoryData(ohlcData) {
    return ohlcData?.map((data, ind) => ({
        sno: ind + 1,
        date: new Intl.DateTimeFormat("en-IN").format(data?.time),
        openValue: data?.open,
        highValue: data?.high,
        lowValue: data?.low,
        closeValue: data?.close,
        highLowDiffValue: data?.high - data?.low,
        openCloseDiffValue: data?.close - data?.open,
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