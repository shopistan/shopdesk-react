import React, { useState, useEffect } from "react";

import { Button, message, Select, Input } from "antd";
import { PlusCircleOutlined, DownloadOutlined } from "@ant-design/icons";
import CustomerTable from "../../organism/table/customerTable";
import { useHistory } from "react-router-dom";
import * as CustomersApiUtil from "../../../utils/api/customer-api-utils";
import Constants from '../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";



const Customers = () => {
  const [paginationLimit, setPaginationLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [userLocalStorageData, setUserLocalStorageData] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);

  const { Option } = Select;
  const { Search } = Input;
  const history = useHistory();


  var mounted = true;


  const onSearch = async (e) => {
    let searchValue = e.target.value;
    if(searchValue === ""){ // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchCustomersData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);   //imp
    fetchSearchCustomers(paginationLimit, 1, searchValue);
  }


  const fetchSearchCustomers = async (pageLimit = 20, pageNumber = 1, searchValue) => {
    const customersSearchResponse = await CustomersApiUtil.searchCustomers(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('couriersSearchResponse:', customersSearchResponse);
    if (customersSearchResponse.hasError) {
      console.log('Cant Search Customers -> ', customersSearchResponse.errorMessage);
      message.error(customersSearchResponse.errorMessage, 2);
      setLoading(false);
    }
    else {
      console.log('res -> ', customersSearchResponse.message);
      if (mounted) {     //imp if unmounted
        setData(customersSearchResponse.Customer.data);
        setPaginationData(customersSearchResponse.Customer.page);
        setLoading(false);
      }
    }
    
  }



  const fetchCustomersData = async (pageLimit = 20, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const customersViewResponse = await CustomersApiUtil.viewCustomers(
      pageLimit,
      pageNumber
    );
    console.log("customers view response:", customersViewResponse);

    if (customersViewResponse.hasError) {
      console.log(
        "Cant fetch customers -> ",
        customersViewResponse.errorMessage
      );
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", customersViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(customersViewResponse.message, 3);
        setData(customersViewResponse.Customer.data || customersViewResponse.Customer);
        setPaginationData(customersViewResponse.Customer.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  };


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCustomersData(paginationLimit, currentPg);
  }
  

  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchCustomers(paginationLimit, currentPg, searchedData);
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



  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if(searchedData){   //imp is search data exists
      if (currentPageSearched > Math.ceil(paginationData.totalElements / value)) {
        fetchSearchCustomers(value, 1, searchedData);
      } else {
        fetchSearchCustomers(value, currentPageSearched, searchedData);
      }
    }  /*------end of outer if---------*/
    else {
      if (currentPage > Math.ceil(paginationData.totalElements / value)) {
        fetchCustomersData(value, 1);
      } else {
        fetchCustomersData(value, currentPage);
      }  /*------end of outer else---------*/
    }

  }



  const ExportToCsv = async (e) => {
    if (data.length > 0) {
      document.getElementById('app-loader-container').style.display = "block";
      const hide = message.loading('Exporting Customers Is In Progress..', 0);
      const getuserResponse = await CustomersApiUtil.getUserId();
      console.log("customers export response:", getuserResponse);
      if (getuserResponse.hasError) {
        const errorMessage = getuserResponse.errorMessage;
        console.log('Cant get User Id -> ', errorMessage);
        message.error(errorMessage, 3);
        document.getElementById('app-loader-container').style.display = "none";
        setTimeout(hide, 1500);
      } else {
        console.log("Success:", getuserResponse.message);
        exportCustomersData(hide, getuserResponse.user_id || null);
      }
    }
    else { 
      message.error("No Customer Data Found", 3);
    }

  }


  const exportCustomersData = async (hide, currentUserId) => {
    console.log("currentUserId", currentUserId);
    const customersExportResponse = await CustomersApiUtil.exportCustomers(currentUserId);
    console.log("customers export response:", customersExportResponse);

    if (customersExportResponse.hasError) {
      console.log(
        "Cant Export customers -> ",
        customersExportResponse.errorMessage
      );
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(hide, 1500);
    } else {
      console.log("res -> ", customersExportResponse.data);
      document.getElementById('app-loader-container').style.display = "none";
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
            onClick={ExportToCsv}  icon={<DownloadOutlined />}
          >
            Export CSV
          </Button>
        </div>
      </div>
      <div className="page__content">

      <div className="action-row">
          <div className="action-row__element">
            Show
            <Select
              defaultValue="10"
              style={{ width: 120, margin: "0 5px" }}
              onChange={handleChange}
            >
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
              <Option value="100">100</Option>
            </Select>
            entries
          </div>

          <div className="action-row__element">
            <Search
              placeholder="search customers"
              allowClear
              //enterButton='Search'
              size="large"
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table">
          <CustomerTable
            pageLimit={paginationLimit}
            paginationData={paginationData}
            tableData={data}
            tableDataLoading={loading}
            onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
            currentPageIndex={searchedData ? currentPageSearched : currentPage}
            tableId='customers-list-table'
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Customers;
