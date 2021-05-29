import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Table } from "antd";
import moment from "moment";
import LineIndicator from "./../../components/line-indicator";

const FlipSideCryptoAPIKey = "e5c05c00-3cd0-4896-a2f7-e9e7821a5e36";

function Ratings({ coinDetails }) {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileSideAnalysis, setFileSideAnalysis] = useState(null);

  useEffect(() => {
    getFlipSideCryptoProjects();
  }, [coinDetails]);

  async function getFlipSideCryptoProjects() {
    try {
      const {
        data: { data: allProjects },
      } = await axios.get(
        `https://api.flipsidecrypto.com/api/v2/metrics/projects`,
        {
          params: {
            api_key: FlipSideCryptoAPIKey,
          },
        }
      );
      const projectDetails = allProjects.find(
        (data) => data?.symbol === coinDetails?.target_currency_short_name
      );
      setFileSideAnalysis({
        ...fileSideAnalysis,
        projectDetails,
      });
      if (projectDetails) getFlipSideCryptoAnalysis(projectDetails?.id);
    } catch (err) {
      console.error(err);
    }
  }

  async function getFlipSideCryptoAnalysis(projectId) {
    try {
      const {
        data: { data: projectScoresData },
      } = await axios.post(
        `https://api.flipsidecrypto.com/api/v2/metrics/timeseries/projects`,
        {
          start_timestamp: moment().add(-7, "d").toISOString(),
          end_timestamp: moment().toISOString(),
          project_ids: [projectId],
          moving_average_in_days: 1,
          metrics: ["fcas", "dev", "market-maturity", "utility"],
        },
        {
          params: {
            api_key: FlipSideCryptoAPIKey,
          },
        }
      );
      const projectMetricsData = projectScoresData[0];
      const metrics = projectMetricsData?.metrics;
      const projectScores = {
        fcas: metrics
          .find((metric) => metric.slug === "fcas")
          ?.timeseries?.slice()
          ?.reverse()?.[0]?.value,
        dev: metrics
          .find((metric) => metric.slug === "dev")
          ?.timeseries?.slice()
          ?.reverse()?.[0]?.value,
        "market-maturity": metrics
          .find((metric) => metric.slug === "market-maturity")
          ?.timeseries?.slice()
          ?.reverse()?.[0]?.value,
        utility: metrics
          .find((metric) => metric.slug === "utility")
          ?.timeseries?.slice()
          ?.reverse()?.[0]?.value,
      };
      setFileSideAnalysis({
        ...fileSideAnalysis,
        projectScores,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Row>
      {fileSideAnalysis?.projectDetails && (
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card className="gx-card" title="Flip Side Crypto Analysis">
            <div className="gx-table-responsive">
              <ul className="gx-line-indicator gx-fs-sm gx-pb-1 gx-pb-sm-0">
                <li>
                  <LineIndicator
                    width={(fileSideAnalysis?.projectScores?.fcas / 1000) * 100}
                    title="FCAS"
                    color="primary"
                    value={fileSideAnalysis?.projectScores?.fcas}
                  />
                </li>
                <li>
                  <LineIndicator
                    width={(fileSideAnalysis?.projectScores?.dev / 1000) * 100}
                    title="Developer Score"
                    color="pink"
                    value={fileSideAnalysis?.projectScores?.dev}
                  />
                </li>
                <li>
                  <LineIndicator
                    width={
                      (fileSideAnalysis?.projectScores?.["market-maturity"] /
                        1000) *
                      100
                    }
                    title="Market Maturity Score"
                    color="orange"
                    value={fileSideAnalysis?.projectScores?.["market-maturity"]}
                  />
                </li>
                <li>
                  <LineIndicator
                    width={
                      (fileSideAnalysis?.projectScores?.utility / 1000) * 100
                    }
                    title="Utility Score"
                    color="green"
                    value={fileSideAnalysis?.projectScores?.utility}
                  />
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      )}
    </Row>
  );
}

export default Ratings;
