import { Card, Col, Row, Spin, Transfer } from "antd";
import { useState } from "react";
import { connect } from "react-redux";

function Preferences({ marketMetaDetails }) {
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState(
    JSON.parse(localStorage.getItem("preferredCoins") || '[]')
  );
  const [selectedKeys, setSelectedKeys] = useState([]);
  const allSources = marketMetaDetails.map((market) => ({
    key: market.pair,
    title: market.pair,
  }));

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    localStorage.setItem("preferredCoins", JSON.stringify(nextTargetKeys));
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card className="gx-card" title="Preferences">
            <Spin spinning={loading}>
              <Transfer
                showSearch
                dataSource={allSources}
                titles={["All Coins", "Favorite Coins"]}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                render={(item) => item.title}
                listStyle={{
                  width: "100%",
                  height: 500,
                }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    marketMetaDetails: state.marketMetaDetails,
  };
};

export default connect(mapStateToProps)(Preferences);
