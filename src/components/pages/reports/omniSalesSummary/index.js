import React, { useEffect, useState } from "react";
import "../style.scss";
import { DatePicker, Button, message, Row, Col, Card, Divider } from "antd";
import { BarsOutlined, DownloadOutlined } from "@ant-design/icons";
import SalesSummaryTable from "../../../organism/table/reports/salesSummaryTable";
import PrintOverviewSalesTable from "../salesSummary/printOverviewSales";
import * as ReportsApiUtil from '../../../../utils/api/reports-api-utils';
import Constants from '../../../../utils/constants/constants';
import { getDataFromLocalStorage, checkUserAuthFromLocalStorage } from "../../../../utils/local-storage/local-store-utils";
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';



const OmniSalesSummary = () => {
  let mops = {
    cash: 0,
    credit: 0,
    customer: 0,
    discounts: 0
  };
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const [omniSalesSummaryData, setOmniSalesSummaryData] = useState([]);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [selectedDates, setselectedDates] = useState([]);
  const [user, setUser] = useState({});
  const [salesMops, setSalesMops] = useState(mops);



  const fetchOmniSalesSumaryData = async () => {
    let ecommerce = true;
    let startDate = selectedDates[0];
    let endDate = selectedDates[1];

    const omnisalesSummaryResponse = await ReportsApiUtil.viewSalesSummery(startDate, endDate, ecommerce);
    console.log('OmnisalesSummaryResponse:', omnisalesSummaryResponse);

    if (omnisalesSummaryResponse.hasError) {
      console.log('Cant fetch omni Sales Data -> ', omnisalesSummaryResponse.errorMessage);
      message.error(omnisalesSummaryResponse.errorMessage, 3);
      setLoading(false);
    }
    else {
      console.log('res -> ', omnisalesSummaryResponse);
      message.success(omnisalesSummaryResponse.message, 3);
      setOmniSalesSummaryData(omnisalesSummaryResponse.sales_summary);
      setLoading(false);
      setShowSummaryTable(true);  //imp to show
      /*--setting sales Mops--*/
      var omniSalesData = omnisalesSummaryResponse.sales_summary;
      let salesDataMops = {
        cash: 0,
        credit: 0,
        customer: 0,
        discounts: 0
      };
      omniSalesData.forEach(element => {
        if (element.MOP == "Credit Card") {
          salesDataMops.credit += parseFloat(element.gross_sale);
        } else if (element.MOP == "Cash") {
          salesDataMops.cash += parseFloat(element.gross_sale);
        } else {
          salesDataMops.customer += parseFloat(element.gross_sale);
        }
      });

      salesDataMops.discounts = parseFloat(omnisalesSummaryResponse.invoice_discount);

      setSalesMops(salesDataMops);  //setting sales mops

      /*--setting sales Mops--*/

    }
  }



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



  const handleRangePicker = (values) => {
    let startDate = moment(values[0]).format(dateFormat);
    let endDate = moment(values[1]).format(dateFormat);
    setselectedDates([startDate, endDate]);
  }


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
    var rows = document.querySelectorAll("div#omni_sales_summary_data_table  tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++)
        row.push(cols[j].innerText);

      csv.push(row.join(","));
    }

    // Download CSV
    download_csv(csv.join("\n"), filename);
  }


  const DownloadToCsv = (e) => {

    if (omniSalesSummaryData.length > 0) {
      var html = document.getElementById('omni_sales_summary_data_table').innerHTML;

      export_table_to_csv(html, "omni_sales_summary.csv");

    }
    else { message.error("No Omni Sales Data Found", 3) }

  }


  const handlePrintOverview = (e) => {
    var previewSalesHtml = document.getElementById('printTable').innerHTML;
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

  }



  return (
    <>

      {showSummaryTable &&
        <PrintOverviewSalesTable user={user} salesSummaryMopsData={salesMops}
          calenderDates={selectedDates} />}


      <div className='page reports-omni'>
        <div className='page__header'>
          <h1>Omni Sales Summary</h1>
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            onClick={DownloadToCsv}
          > Download</Button>
        </div>

        <div className='page__content'>
          <div className='action-row'>
            <RangePicker className='date-picker'
              onCalendarChange={handleRangePicker}
            />
            <Button type='primary' icon={<BarsOutlined />} onClick={fetchOmniSalesSumaryData}>
              Fetch
            </Button>
          </div>

          <Divider />



          {showSummaryTable &&
            <div>
              <Row gutter={16, 16}>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className="card-shade">
                      <h4>Cash</h4>
                      <h2 className="card-pull-right">{salesMops.cash.toFixed(2)}</h2>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div class="card-shade">
                      <h4>Credit Card</h4>
                      <h2 className="card-pull-right">{salesMops.credit.toFixed(2)}</h2>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className="card-shade">
                      <h4>Customer Layby</h4>
                      <h2 className="card-pull-right">{salesMops.customer.toFixed(2)}</h2>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card className='card-container'>
                    <div className="card-shade">
                      <h4>Invoice Discounts</h4>
                      <h2 className="card-pull-right">{salesMops.discounts.toFixed(2)}</h2>
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
                > Print overview</Button>
              </div>
              <Divider />
            </div>}


          {showSummaryTable &&
            <div className='table'>{/* Insert Table Here */}
              <div className='form__section__header'>
                <h3 className='variants-heading'>Omni Sales Summary</h3>
              </div>
              <SalesSummaryTable tableId='omni_sales_summary_data_table' pageLimit={20} tableData={omniSalesSummaryData}
                 tableDataLoading={loading}  summaryTableType='omni' />
            </div>}

        </div>

      </div>

    </>

  );
};

export default OmniSalesSummary;
