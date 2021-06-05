import { Link } from 'react-router-dom';
import ChangeIndicator from '../../../components/change-indicator';

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

// Assumption: ohlcData is already sorted
export function getGrowthRate(ohlcData) {
    const openPrice = ohlcData[0].open;
    const closePrice = ohlcData[ohlcData?.length - 1].close;
    return (closePrice - openPrice) / openPrice * 100
}