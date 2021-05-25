import React, { useEffect, useState } from "react";
import "../style.scss";
import { DatePicker, Button, message, Row, Col, Card, Divider } from "antd";
import { BarsOutlined, DownloadOutlined } from "@ant-design/icons";
import SalesSummaryTable from "../../../organism/table/reports/salesSummaryTable";
import PrintOverviewSalesTable from "./printOverviewSales";
import * as ReportsApiUtil from "../../../../utils/api/reports-api-utils";
import Constants from "../../../../utils/constants/constants";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

const SalesSummary = () => {
  let mops = {
    cash: 0,
    credit: 0,
    customer: 0,
    discounts: 0,
  };
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const [salesSummaryData, setSalesSummaryData] = useState([]);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [selectedDates, setselectedDates] = useState([]);
  const [user, setUser] = useState({});
  const [salesMops, setSalesMops] = useState(mops);

  const fetchSalesSumaryData = async () => {
    //let ecommerce = user.auth.store_ecommerce; //prev version
    let ecommerce = false;
    let startDate = selectedDates[0];
    let endDate = selectedDates[1];

    document.getElementById('app-loader-container').style.display = "block";
    const salesSummaryResponse = await ReportsApiUtil.viewSalesSummery(
      startDate,
      endDate,
      ecommerce
    );
    console.log("salesSummaryResponse:", salesSummaryResponse);

    if (salesSummaryResponse.hasError) {
      console.log(
        "Cant fetch Omni Sales Data -> ",
        salesSummaryResponse.errorMessage
      );
      message.error(salesSummaryResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", salesSummaryResponse);
      message.success(salesSummaryResponse.message, 3);
      setSalesSummaryData(salesSummaryResponse.sales_summary);
      setLoading(false);
      setShowSummaryTable(true); //imp to show
      /*--setting sales Mops--*/
      var omniSalesData = salesSummaryResponse.sales_summary;
      let salesDataMops = {
        cash: 0,
        credit: 0,
        customer: 0,
        discounts: 0,
      };
      omniSalesData.forEach((element) => {
        if (element.MOP == "Credit Card") {
          salesDataMops.credit += parseFloat(element.gross_sale);
        } else if (element.MOP == "Cash") {
          salesDataMops.cash += parseFloat(element.gross_sale);
        } else {
          salesDataMops.customer += parseFloat(element.gross_sale);
        }
      });

      salesDataMops.discounts = parseFloat(
        salesSummaryResponse.invoice_discount
      );

      setSalesMops(salesDataMops); //setting sales mops
      document.getElementById('app-loader-container').style.display = "none";

      /*--setting sales Mops--*/
    }
  };

  useEffect(() => {
    /*-----------set user store */
    var readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        setUser(readFromLocalStorage);
      }
    }
    /*-----------set user store */
  }, []);

  const fetchSalesSummary = (e) => {
    fetchSalesSumaryData();
  };

  const handleRangePicker = (values) => {
    if (values) {
      let startDate = moment(values[0]).format(dateFormat);
      let endDate = moment(values[1]).format(dateFormat);
      setselectedDates([startDate, endDate]);
    }
  };

  function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  }

  function export_table_to_csv(html, filename) {
    var csv = [];
    //imp selection below
    var rows = document.querySelectorAll("div#sales_summary_data_table  tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

      csv.push(row.join(","));
    }

    // Download CSV
    download_csv(csv.join("\n"), filename);
  }

  const DownloadToCsv = (e) => {
    if (salesSummaryData.length > 0) {
      var html = document.getElementById("sales_summary_data_table").innerHTML;

      export_table_to_csv(html, "sales_summary.csv");
    } else {
      message.warning("No Sales Data Found", 3);
    }
  };

  const handlePrintOverview = (e) => {
    var previewSalesHtml = document.getElementById("printTable").innerHTML;
    var doc =
      '<html><head><title>Close Me ~ Shopdesk</title><link rel="stylesheet" type="text/css" href="css/print.css" /></head><body onload="window.print(); window.close();">' +
      previewSalesHtml +
      "</body></html>";
    /* NEW TAB OPEN PRINT */
    var popupWin = window.open("", "_blank");
    popupWin.document.open();
    // window.print(); window.close(); 'width: 80%, height=80%'
    popupWin.document.write(doc);
    //popupWin.document.close();  //vvimp for autoprint
  };

  return (
    <>
      {showSummaryTable && (
        <PrintOverviewSalesTable
          user={user}
          salesSummaryMopsData={salesMops}
          calenderDates={selectedDates}
        />
      )}

      <div className='page reports'>
        <div className='page__header'>
          <h1>Sales Summary</h1>
          <Button
            type='primary'
            className='custom-btn custom-btn--primary'
            icon={<DownloadOutlined />}
            onClick={DownloadToCsv}
          >
            {" "}
            Download
          </Button>
        </div>

        <div className='page__content'>
          <div className='action-row'>
            <RangePicker
              className='date-picker'
              onCalendarChange={handleRangePicker}
            />
            <Button
              type='primary'
              icon={<BarsOutlined />}
              onClick={fetchSalesSummary}
              className='custom-btn custom-btn--primary'
            >
              Fetch
            </Button>
          </div>

          <Divider />

          {showSummaryTable && (
            <div>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className='card-shade'>
                      <h4>Cash</h4>
                      <h2 className='card-pull-right'>
                        {salesMops.cash.toFixed(2)}
                      </h2>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className='card-shade'>
                      <h4>Credit Card</h4>
                      <h2 className='card-pull-right'>
                        {salesMops.credit.toFixed(2)}
                      </h2>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className='card-shade'>
                      <h4>Customer Layby</h4>
                      <h2 className='card-pull-right'>
                        {salesMops.customer.toFixed(2)}
                      </h2>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className='card-shade'>
                      <h4>Invoice Discounts</h4>
                      <h2 className='card-pull-right'>
                        {salesMops.discounts.toFixed(2)}
                      </h2>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <div className='print-overview-btn'>
                <Button
                  type='primary'
                  icon={<DownloadOutlined />}
                  onClick={handlePrintOverview}
                >
                  {" "}
                  Print overview
                </Button>
              </div>
              <Divider />
            </div>
          )}

          {showSummaryTable && (
            <div className='table'>
              {/* Insert Table Here */}
              <div className='form__section__header'>
                <h3 className='variants-heading'>Sales Summary</h3>
              </div>
              <SalesSummaryTable
                tableId='sales_summary_data_table'
                pageLimit={20}
                tableData={salesSummaryData}
                tableDataLoading={loading}
                summaryTableType='simple_sales'
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesSummary;
