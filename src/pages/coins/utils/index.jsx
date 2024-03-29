import { SearchOutlined } from "@ant-design/icons";
import { Input, Button, Space } from "antd";
import { Link } from 'react-router-dom';

export function getColumnSearchProps(dataIndex) {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {},
  };
}

function handleSearch(selectedKeys, confirm, dataIndex) {
  confirm();
}

function handleReset(clearFilters) {
  clearFilters();
}

export const coinsColumns = [
  {
    title: "S.No",
    dataIndex: "sno",
    key: "sno",
    sorter: (a, b) => a.sno - b.sno,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    ...getColumnSearchProps("name"),
  },
  {
    title: "Symbol",
    dataIndex: "displayName",
    key: "displayName",
    render: (text, record) => <Link to={`/coins/${record?.coinDCXName}`}>{text}</Link>,
    ...getColumnSearchProps("symbol"),
  },
  {
    title: "Current Price",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.priceValue - b.priceValue,
  },
  {
    title: "24H High",
    dataIndex: "high",
    key: "high",
    sorter: (a, b) => a.highValue - b.highValue,
  },
  {
    title: "24H Low",
    dataIndex: "low",
    key: "low",
    sorter: (a, b) => a.lowValue - b.lowValue,
  },
  {
    title: "24H Change",
    dataIndex: "percentageChangeValue",
    key: "percentageChangeValue",
    sorter: (a, b) => a.percentageChangeValue - b.percentageChangeValue,
    render: (text, record) =>
      record?.percentageChangeValue > 0 ? (
        <span className="color-animation text-nowrap text-success">+{text}%</span>
      ) : (
        <span className="color-animation text-nowrap text-danger">{text}%</span>
      ),
  },
];
