import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import CustomerTable from "../../organism/table/customerTable";
import { useHistory } from "react-router-dom";

import * as CustomersApiUtil from "../../../utils/api/customer-api-utils";

const Customers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});


  const history = useHistory();

  const fetchCustomersData = async (pageLimit = 10, pageNumber = 1) => {
    const customersViewResponse = await CustomersApiUtil.viewCustomers(
      pageNumber
    );
    console.log("customers view response:", customersViewResponse);

    if (customersViewResponse.hasError) {
      console.log(
        "Cant fetch customers -> ",
        customersViewResponse.errorMessage
      );
      setLoading(false);
    } else {
      console.log("res -> ", customersViewResponse);
      message.success(customersViewResponse.message, 3);
      setData(customersViewResponse.Customer.data);
      setPaginationData(customersViewResponse.Customer.page || {});
      setLoading(false);
    }
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCustomersData(paginationLimit, currentPg);
  }

  useEffect(() => {
    fetchCustomersData();
  }, []);





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
    var rows = document.querySelectorAll("div#customers-list-table  tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length-1; j++)
        row.push(cols[j].innerText);

      csv.push(row.join(","));
    }

    // Download CSV
    download_csv(csv.join("\n"), filename);
  }


  const DownloadToCsv = (e) => {

    if (data.length > 0) {
      var html = document.getElementById('customers-list-table').innerHTML;

      export_table_to_csv(html, "customers_" + new Date().toUTCString() + ".csv")

    }
    else { message.error("No Customer Data Found", 3) }

  }





  return (
    <div className="page categories">
      <div className="page__header">
        <h1>Customers</h1>

        <div className="page__header__buttons">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              history.push("/customers/add");
            }}
            className="custom-btn custom-btn--primary"
          >
            Add New
          </Button>

          {/*<Button type="primary" className="custom-btn custom-btn--primary">
            Fetch All
          </Button>*/}

          <Button type="primary" className="custom-btn custom-btn--primary"
            onClick={DownloadToCsv}

          >
            Export CSV
          </Button>
        </div>
      </div>
      <div className="page__content">
        {/* Table */}
        <div className="table">
          <CustomerTable
            pageLimit={paginationLimit}
            paginationData={paginationData}
            tableData={data}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            currentPageIndex={currentPage}
            tableId='customers-list-table'
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Customers;
