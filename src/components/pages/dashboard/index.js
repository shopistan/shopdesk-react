import React, { useEffect, useState } from "react";
import "./style.scss";
import { message, Spin, Card, Row, Col, Divider } from "antd";
import { useHistory } from "react-router-dom";
import * as DasboardApiUtil from "../../../utils/api/dashboard-api-utils";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  RiseOutlined,
  HistoryOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [salesToday, setSalesToday] = useState(null);
  const [salesChartData, setSalesChartData] = useState(null);
  const [mostSoldData, setMostSoldData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(async () => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (e) => {
    const hide = message.loading("Getting Product Data..", 0);
    const fetchDashboardDataviewResponse = await DasboardApiUtil.getDashboardData();
    console.log(
      "fetchDashboardDataviewResponse:",
      fetchDashboardDataviewResponse
    );
    if (fetchDashboardDataviewResponse.hasError) {
      console.log(
        "Cant fetch Dashboard Data -> ",
        fetchDashboardDataviewResponse.errorMessage
      );
      message.error(fetchDashboardDataviewResponse.errorMessage, 3);
      setLoading(false);
      setTimeout(hide, 1000);
    } else {
      console.log("res -> ", fetchDashboardDataviewResponse);
      setTimeout(hide, 1000);
      setLoading(false);
      message.success(fetchDashboardDataviewResponse.message, 3);

      /*------formulating data for dashboard graphs------------------*/

      var dashboardData = fetchDashboardDataviewResponse;
      let salesToday = dashboardData.salesToday[0];
      console.log(salesToday);

      setSalesToday(salesToday);

      let salesChartData = {
        labels: [],
        data: {
          sale: [],
          unit: [],
        },
      };
      dashboardData.salesChart.forEach((e) => {
        salesChartData.labels.unshift(
          formatDate(formatDate(e.invoice_datetime))
        );
        salesChartData.data.sale.unshift(e.sale_total);
        salesChartData.data.unit.unshift(e.units);
      });

      setSalesChartData(salesChartData);

      console.log(salesChartData);

      let mostSoldData = {
        data: [],
        labels: [],
      };
      dashboardData.mostSold.forEach((e) => {
        mostSoldData.data.push(e.quantity);
        mostSoldData.labels.push(e.name);
      });

      setMostSoldData(mostSoldData);

      let pieChartData = {
        store: dashboardData.pieChart[0].Store,
        ecommerce: dashboardData.pieChart[0].ecommerce,
      };

      setPieChartData(pieChartData);
    }
  };

  function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var date = new Date(date);

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }

  if (salesChartData) {
    var salesHistoryLineChartDataSets = {
      labels: salesChartData.labels,
      datasets: [
        {
          label: "unit",
          data: salesChartData.data.unit,
          backgroundColor: "rgba(251, 242, 200, 0.8)",
          borderColor: "rgba(251, 242, 200, 1)",
          borderWidth: 1,
          yAxisID: "y-axis-1",
        },
        {
          label: "sale",
          data: salesChartData.data.sale,
          backgroundColor: "rgba(106, 209, 221, 0.8)",
          borderColor: "rgba(106, 209, 221, 1)",
          borderWidth: 1,
          yAxisID: "y-axis-2",
        },
      ],
    };
  }

  if (pieChartData) {
    var salesHistoryPieChartDataSets = {
      labels: ["Store", "Ecommerce"],
      datasets: [
        {
          data: [pieChartData.store, pieChartData.ecommerce],
          backgroundColor: ["#fdd300", "#6bcec6"],
          label: "sales ($)",
        },
      ],
    };
  }

  if (mostSoldData) {
    var salesHistoryMostSoldLineChartDataSets = {
      labels: mostSoldData.labels,
      datasets: [
        {
          label: "unit",
          data: mostSoldData.data,
          backgroundColor: "rgba(255, 177, 194, 0.8)",
          borderColor: "rgba(255, 177, 194, 1)",
          borderWidth: 3,
          yAxisID: "y-axis-1",
          fill: false,
          lineTension: 0,
        },
      ],
    };
  }

  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1>Dashboard</h1>
      </div>
      <div className="loading-container">
        {loading && <Spin size="large" />}
      </div>

      {!loading && (
        <div className="page__content">
          <div className="page__section">
            <h2 className="section__heading">Daily Sales</h2>

            {salesChartData && (
              <div>
                <Line
                  data={salesHistoryLineChartDataSets}
                  options={{
                    title: {
                      display: true,
                      text: "Sales History",
                    },
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "units",
                          },
                          display: true,
                          text: "units",
                          position: "left",
                          id: "y-axis-1",
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "sales ($)",
                          },
                          display: true,
                          position: "right",
                          id: "y-axis-2",
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                    responsive: true,
                  }}
                />
              </div>
            )}
          </div>

          {/* Info Boxes */}
          <div className="page__section">
            {/* New */}
            {salesToday && (
              <div className="info-cards">
                <div className="info-card">
                  <HistoryOutlined
                    style={{ fontSize: "32px" }}
                    className="info-card__icon"
                  />
                  <h2 className="info-card__value">
                    {parseFloat(salesToday.sales_today).toFixed(2)}
                  </h2>
                  <h3 className="info-card__title">Sales Today</h3>
                </div>

                <div className="info-card">
                  <ShoppingCartOutlined
                    style={{ fontSize: "32px" }}
                    className="info-card__icon"
                  />
                  <h2 className="info-card__value">
                    {parseInt(salesToday.sale_count)}
                  </h2>
                  <h3 className="info-card__title">Sales Count</h3>
                </div>

                <div className="info-card">
                  <TagsOutlined
                    style={{ fontSize: "32px" }}
                    className="info-card__icon"
                  />
                  <h2 className="info-card__value">
                    {parseInt(salesToday.product_sold)}
                  </h2>
                  <h3 className="info-card__title">Products Sold</h3>
                </div>

                <div className="info-card">
                  <RiseOutlined
                    style={{ fontSize: "32px" }}
                    className="info-card__icon"
                  />
                  <h2 className="info-card__value">
                    {parseFloat(salesToday.gross_profit).toFixed(2)}
                  </h2>
                  <h3 className="info-card__title">Gross Profit</h3>
                </div>
              </div>
            )}
            {/* New */}

            {/* {salesToday && (
              <div>
                <Row gutter={(16, 16)}>
                  <Col xs={24} sm={12} md={6}>
                    <div class="info data-info">
                      <div class="data">
                        <span class="price">
                          {parseFloat(salesToday.sales_today).toFixed(2)}
                        </span>
                      </div>
                      <div class="row">
                        <p>Sales Today</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <div class="info data-info">
                      <div class="data">
                        <span class="price">
                          {parseInt(salesToday.sale_count)}
                        </span>
                      </div>
                      <div class="row">
                        <p>Sales Count</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <div class="info data-info">
                      <div class="data">
                        <span class="price">
                          {parseInt(salesToday.product_sold)}
                        </span>
                      </div>
                      <div class="row">
                        <p>Product Sold</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <div class="info data-info">
                      <div class="data">
                        <span class="price">
                          {parseFloat(salesToday.gross_profit).toFixed(2)}
                        </span>
                      </div>
                      <div class="row">
                        <p>Gross Profit</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )} */}
          </div>

          {/* Charts */}
          <div className="page__section charts">
            <div className="sales">
              <h2 className="section__heading">Sales History</h2>

              {pieChartData && (
                <Pie
                  data={salesHistoryPieChartDataSets}
                  options={{
                    responsive: true,
                    title: {
                      display: true,
                      text: "Sales Channel",
                    },
                  }}
                />
              )}
            </div>

            <div className="items">
              <h2 className="section__heading">Most Sold Items</h2>

              {mostSoldData && (
                <div>
                  <Line
                    data={salesHistoryMostSoldLineChartDataSets}
                    options={{
                      title: {
                        display: true,
                        text: "Most Sold",
                      },
                      scales: {
                        yAxes: [
                          {
                            scaleLabel: {
                              display: true,
                              labelString: "units",
                            },
                            display: true,
                            text: "units",
                            position: "left",
                            id: "y-axis-1",
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        ],
                      },
                      responsive: true,
                      //maintainAspectRatio: false,  //imp must disabled
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
