import { Card, Table } from "antd";
import { connect } from "react-redux";
import { coinsColumns } from "./utils";

function Coins(props) {
  return (
    <Card className="gx-card">
      <div className="gx-table-responsive">
        <Table
          size="small"
          scroll={{ x: "100%" }}
          loading={props?.marketMetaDetails ? false : true}
          dataSource={Object.values(props?.coinsPriceChanges || {})}
          columns={coinsColumns}
        />
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    coinsCurrentPrice: state.coinsCurrentPrice,
    marketMetaDetails: state.marketMetaDetails,
    coinsPriceChanges: state.coinsPriceChanges,
  };
};

export default connect(mapStateToProps)(Coins);
