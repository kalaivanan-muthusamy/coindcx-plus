import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Table, Tooltip } from "antd";
import moment from "moment";
import LineIndicator from "./../../components/line-indicator";

const FlipSideCryptoAPIKey = "e5c05c00-3cd0-4896-a2f7-e9e7821a5e36";

function Ratings({ coinDetails }) {
  const [flipSideScores, setFlipSideScores] = useState(null);

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
          ?.timeseries?.filter((a) => a.value !== null)
          .slice()
          ?.reverse()?.[0]?.value,
        dev: metrics
          .find((metric) => metric.slug === "dev")
          ?.timeseries?.filter((a) => a.value !== null)
          .slice()
          ?.reverse()?.[0]?.value,
        "market-maturity": metrics
          .find((metric) => metric.slug === "market-maturity")
          ?.timeseries?.filter((a) => a.value !== null)
          .slice()
          ?.reverse()?.[0]?.value,
        utility: metrics
          .find((metric) => metric.slug === "utility")
          ?.timeseries?.filter((a) => a.value !== null)
          .slice()
          ?.reverse()?.[0]?.value,
      };
      setFlipSideScores(projectScores);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Row>
      {flipSideScores && (
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card className="gx-card" title="Flipside Crypto Analysis">
            <div className="gx-table-responsive">
              <ul className="gx-line-indicator gx-fs-sm gx-pb-1 gx-pb-sm-0">
                <li>
                  <LineIndicator
                    width={(flipSideScores?.fcas / 1000) * 100}
                    title={
                      <div className="d-flex">
                        <span>FCAS </span>
                        <Tooltip
                          className="text-muted ms-1 pt-1"
                          title="A proprietary rating derived from the activity of developers, on chain behaviors and market activity."
                        >
                          <i className="icon icon-sweet-alert" />
                        </Tooltip>
                      </div>
                    }
                    color="primary"
                    value={flipSideScores?.fcas}
                  />
                </li>
                <li>
                  <LineIndicator
                    width={(flipSideScores?.dev / 1000) * 100}
                    title={
                      <div className="d-flex">
                        <span>Developer Score </span>
                        <Tooltip
                          className="text-muted ms-1 pt-1"
                          title="A daily composite score representing the amount and type of work being done on a product. This score tracks activity across three major categories: changes to the codebase, major releases and updates, and community involvement."
                        >
                          <i className="icon icon-sweet-alert" />
                        </Tooltip>
                      </div>
                    }
                    color="pink"
                    value={flipSideScores?.dev}
                  />
                </li>
                <li>
                  <LineIndicator
                    width={(flipSideScores?.["market-maturity"] / 1000) * 100}
                    title={
                      <div className="d-flex">
                        <span>Market Maturity Score </span>
                        <Tooltip
                          className="text-muted ms-1 pt-1"
                          title="Market Maturity, derived from Risk and Money Supply factors, represents the likelihood a crypto asset will provide consistent returns across various market scenarios by combining assessments of market risk (specifically, exchange liquidity, price projections, price cliff potential, algorithmic prediction consistency, and price volatility), as well as an analysis of the stability of the Money Supply of each tracked project. The less stable the Money Supply, and the more controlled it is by a few addresses, the worse the Money Supply score."
                        >
                          <i className="icon icon-sweet-alert" />
                        </Tooltip>
                      </div>
                    }
                    color="orange"
                    value={flipSideScores?.["market-maturity"]}
                  />
                </li>
                <li>
                  <LineIndicator
                    width={(flipSideScores?.utility / 1000) * 100}
                    title={
                      <div className="d-flex">
                        <span>Utility Score </span>
                        <Tooltip
                          className="text-muted ms-1 pt-1"
                          title="A distilled representation of non-exchange related economic activity. Computed daily."
                        >
                          <i className="icon icon-sweet-alert" />
                        </Tooltip>
                      </div>
                    }
                    color="green"
                    value={flipSideScores?.utility}
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
