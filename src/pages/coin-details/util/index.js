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
        formattedTime: moment(data?.time).format('hh:mm'),
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


const skipTimeFor = ["1d", "3d", "1w", "1M"];
export const historicalDataColumns = (dataInterval) => [
    {
        title: "S.N",
        dataIndex: "sno",
        key: "sno",
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (text, record) => {
            return (
                <div>
                    <div>{text}</div>
                    {!skipTimeFor.includes(dataInterval) && (
                        <div>{record?.formattedTime}</div>
                    )}
                </div>
            );
        },
    },
    {
        title: "Open",
        dataIndex: "open",
        key: "open",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxOpen === record?.openValue
                    ? "high-indicator"
                    : record?.maxMinData?.minOpen === record?.openValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    <span className={className}>{text}</span>
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "Close",
        dataIndex: "close",
        key: "close",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxClose === record?.closeValue
                    ? "high-indicator"
                    : record?.maxMinData?.minClose === record?.closeValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    <span className={className}>{text}</span>
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "High",
        dataIndex: "high",
        key: "high",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxHigh === record?.highValue
                    ? "high-indicator"
                    : record?.maxMinData?.minHigh === record?.highValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    <span className={className}>{text}</span>
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "Low",
        dataIndex: "low",
        key: "low",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxLow === record?.lowValue
                    ? "high-indicator"
                    : record?.maxMinData?.minLow === record?.lowValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    <span className={className}>{text}</span>
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "HL Diff",
        dataIndex: "highLowDiff",
        key: "highLowDiff",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxHLDiff === record?.highLowDiffValue
                    ? "high-indicator"
                    : record?.maxMinData?.minHLDiff === record?.highLowDiffValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    <span className={className}>{text}</span>
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "OH Diff",
        dataIndex: "openHighDiff",
        key: "openHighDiff",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxOHDiff === record?.openHighDiffValue
                    ? "high-indicator"
                    : record?.maxMinData?.minOHDiff === record?.openHighDiffValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    {record?.highValue > record?.openValue ? (
                        <span className={`${className} text-nowrap text-success`}>
                            +{text}
                        </span>
                    ) : (
                        <span className={`${className} text-nowrap text-danger`}>
                            {text}
                        </span>
                    )}
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "OC Diff",
        dataIndex: "openCloseDiff",
        key: "openCloseDiff",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxOCDiff === record?.openCloseDiffValue
                    ? "high-indicator"
                    : record?.maxMinData?.minOCDiff === record?.openCloseDiffValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    {record?.closeValue > record?.openValue ? (
                        <span className={`${className} text-nowrap text-success`}>
                            +{text}
                        </span>
                    ) : (
                        <span className={`${className} text-nowrap text-danger`}>
                            {text}
                        </span>
                    )}
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "LC Diff",
        dataIndex: "lowCloseDiff",
        key: "lowCloseDiff",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxLCDiff === record?.lowCloseDiffValue
                    ? "high-indicator"
                    : record?.maxMinData?.minLCDiff === record?.lowCloseDiffValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    {record?.closeValue > record?.lowValue ? (
                        <span className={`${className} text-nowrap text-success`}>
                            +{text}
                        </span>
                    ) : (
                        <span className={`${className} text-nowrap text-danger`}>
                            {text}
                        </span>
                    )}
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
    {
        title: "Volume",
        dataIndex: "volume",
        key: "volume",
        render: (text, record) => {
            const className =
                record?.maxMinData?.maxVolume === record?.volumeValue
                    ? "high-indicator"
                    : record?.maxMinData?.minVolume === record?.volumeValue
                        ? "low-indicator"
                        : "";
            return (
                <div className="high-low-indicator">
                    <span className={className}>{text}</span>
                    <span className={"high-low-indicator-bg " + className + "-bg"}></span>
                </div>
            );
        },
    },
];