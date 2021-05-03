import React, { useState, useEffect } from "react";

import { Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CustomerTable from "../../organism/table/customerTable";
import { useHistory } from "react-router-dom";
import * as CustomersApiUtil from "../../../utils/api/customer-api-utils";
import Constants from '../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";



const Customers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [userLocalStorageData, setUserLocalStorageData] = useState("");



  const history = useHistory();

  var mounted = true;

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
      if (mounted) {     //imp if unmounted
        message.success(customersViewResponse.message, 3);
        setData(customersViewResponse.Customer.data);
        setPaginationData(customersViewResponse.Customer.page || {});
        setLoading(false);
      }
    }
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCustomersData(paginationLimit, currentPg);
  }

  useEffect(() => {
    fetchCustomersData();
    /*--------------set user local data-------------------------------*/
    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    setUserLocalStorageData(readFromLocalStorage.auth || null);
    /*--------------set user local data-------------------------------*/
    return () => {
      mounted = false;
    }
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

      for (var j = 0; j < cols.length - 1; j++)
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



  const ExportToCsv = async (e) => {

    if (data.length > 0) {
      const hide = message.loading('Exporting Customers Is In Progress..', 0);
      const customersExportResponse = await CustomersApiUtil.exportCustomers(userLocalStorageData.userId || null);
      console.log("customers export response:", customersExportResponse);

      if (customersExportResponse.hasError) {
        console.log(
          "Cant Export customers -> ",
          customersExportResponse.errorMessage
        );
        setTimeout(hide, 1500);
      } else {
        console.log("res -> ", customersExportResponse.data);
        setTimeout(hide, 1500);
        /*---------------csv download--------------------------------*/
        if (mounted) {     //imp if unmounted
          // CSV FILE
          let csvFile = new Blob([customersExportResponse.data], { type: "text/csv" });
          let url = window.URL.createObjectURL(csvFile);
          let a = document.createElement('a');
          a.href = url;
          a.download = "customers_" + new Date().toUTCString() + ".csv";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();  //afterwards we remove the element again
          /*---------------csv download--------------------------------*/
          message.success(customersExportResponse.message, 3);
        }

      }

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
            onClick={ExportToCsv}
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
