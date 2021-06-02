import React, { useEffect, useState } from "react";
import "../style.scss";
import { DatePicker, Button, message, Divider } from "antd";
import { BarsOutlined, DownloadOutlined } from "@ant-design/icons";
import CategoriesSalesSummaryTable from "../../../organism/table/reports/categorySalesSummaryTable";
import * as ReportsApiUtil from "../../../../utils/api/reports-api-utils";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

const CategoryWiseSummary = () => {
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(false);
  const [
    CategoryWiseSalesSummaryData,
    setCategoryWiseSalesSummaryData,
  ] = useState([]);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [selectedDates, setselectedDates] = useState([]);

  const getCategoryWiseSalesSummary = async () => {
    let startDate = selectedDates[0];
    let endDate = selectedDates[1];

    document.getElementById('app-loader-container').style.display = "block";
    const categoryWiseSalesSummaryResponse = await ReportsApiUtil.viewCategoryWiseSalesSummery(
      startDate,
      endDate
    );
    console.log(
      "categoryWiseSalesSummaryResponse:",
      categoryWiseSalesSummaryResponse
    );

    if (categoryWiseSalesSummaryResponse.hasError) {
      console.log(
        "Cant fetch Sales Summary -> ",
        categoryWiseSalesSummaryResponse.errorMessage
      );
      message.warning(categoryWiseSalesSummaryResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";

    } else {
      console.log("res -> ", categoryWiseSalesSummaryResponse);
      //message.success(categoryWiseSalesSummaryResponse.message, 3);
      /*--setting sales Mops--*/
      var categoryWiseSalesData = categoryWiseSalesSummaryResponse.sales;
      categoryWiseSalesData.forEach((salesItem, i) => {
        salesItem.meta = {
          quantity: 0,
          retail_price: 0,
          sale_price: 0,
          cost: 0,
          margin: 0,
        };
        salesItem.sales.map((item) => {
          salesItem.meta.quantity += parseFloat(item.quantity);
          salesItem.meta.retail_price += parseFloat(item.retail_price);
          salesItem.meta.sale_price += parseFloat(item.sale_price);
          salesItem.meta.cost += parseFloat(item.cost);
          salesItem.meta.margin += parseFloat(item.margin);
        });
      });

      /*--setting sales Mops--*/

      ///////////////////////////////
      setCategoryWiseSalesSummaryData(categoryWiseSalesData);
      setLoading(false);
      setShowSummaryTable(true); //imp to show
      document.getElementById('app-loader-container').style.display = "none";
      ////////////////////////////////
    }
  };

  useEffect(() => {}, []);

  const fetchCategoryWiseSalesSummary = (e) => {
    getCategoryWiseSalesSummary();
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
    var rows = document.querySelectorAll(
      "div#category_wise_sales_summary_data_table  tr"
    );

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
    if (CategoryWiseSalesSummaryData.length > 0) {
      var html = document.getElementById(
        "category_wise_sales_summary_data_table"
      ).innerHTML;

      export_table_to_csv(html, "category_wise_sales_summary.csv");
    } else {
      message.warning("No Category Wise Sales Data Found", 3);
    }
  };

  return (
    <div className='page reports reports-category-wise'>
      <div className='page__header'>
        <h1>Category Report</h1>
        <Button
          type='primary'
          icon={<DownloadOutlined />}
          className='custom-btn custom-btn--primary'
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
            onClick={fetchCategoryWiseSalesSummary}
          >
            Fetch
          </Button>
        </div>

        <Divider />

        {showSummaryTable && (
          <div className='table'>
            {/* Insert Table Here */}
            <div className='form__section__header'>
              <h3 className='variants-heading'>Category Wise Report</h3>
            </div>
            <CategoriesSalesSummaryTable
              tableId='category_wise_sales_summary_data_table'
              pageLimit={20}
              tableData={CategoryWiseSalesSummaryData}
              tableDataLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryWiseSummary;
