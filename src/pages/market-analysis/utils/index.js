import { Link } from 'react-router-dom';
import ChangeIndicator from '../../../components/change-indicator';
import SyntaxHighlighter from 'react-syntax-highlighter';

export const growthDataColumns = [
    {
        title: "S.No",
        dataIndex: "sno",
        key: "sno",
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <div>
                <Link to={`/coins/${record?.coinDCXName}`}>{text}</Link>
                <div className="text-secondary">({record?.symbol})</div>
            </div>
        )
    },
    {
        title: "Open",
        dataIndex: "open",
        key: "open",
        sorter: (a, b) => a.openValue - b.openValue,

    },
    {
        title: "Close",
        dataIndex: "close",
        key: "close",
        sorter: (a, b) => a.closeValue - b.closeValue,
    },
    {
        title: "Growth",
        dataIndex: "growth",
        key: "growth",
        sorter: (a, b) => a.growthValue - b.growthValue,
        render: (text, record) => <ChangeIndicator change={record?.growthValue} />
    },
]


export const candleDataColumns = [
    {
        title: "S.No",
        dataIndex: "sno",
        key: "sno",
    },
    {
        title: "Name",
        dataIndex: "pair",
        key: "pair",
        render: (text, record) => (
            <div>
                <Link to={`/coins/${record?.pair}`}>{record?.pair}</Link>
                <div className="text-secondary">({record?.pair})</div>
            </div>
        )
    },
    {
        title: "Candle Combinations",
        dataIndex: "pair",
        key: "pair",
        render: (counts, record) => (
            <>
                <div>RED:
                    <SyntaxHighlighter language="json">
                        {JSON.stringify(record?.RED)}
                    </SyntaxHighlighter>
                </div>
                <div>GREEN:
                    <SyntaxHighlighter language="json">
                        {JSON.stringify(record?.GREEN)}
                    </SyntaxHighlighter>
                </div>
            </>
        )

    },
    {
        title: "Max Red",
        dataIndex: "maxRed",
        key: "maxRed",
        sorter: (a, b) => a.maxRed - b.maxRed,
    },
    {
        title: "Max Green",
        dataIndex: "maxGreen",
        key: "maxGreen",
        sorter: (a, b) => a.maxGreen - b.maxGreen,
    },
]

// Assumption: ohlcData is already sorted
export function getGrowthRate(ohlcData) {
    const openPrice = ohlcData[0].open;
    const closePrice = ohlcData[ohlcData?.length - 1].close;
    return (closePrice - openPrice) / openPrice * 100
}