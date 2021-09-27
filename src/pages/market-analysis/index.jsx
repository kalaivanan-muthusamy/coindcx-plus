import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import DipChecker from "./dip-checker";

function MarketAnalysis() {
  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <DipChecker />
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    coinsCurrentPrice: state.coinsCurrentPrice,
    marketMetaDetails: state.marketMetaDetails,
    coinsPriceChanges: state.coinsPriceChanges,
  };
};

export default connect(mapStateToProps)(MarketAnalysis);
