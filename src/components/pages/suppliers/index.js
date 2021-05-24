import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableSupplier from "../../organism/table/suppliersTable";
import * as SuppliersApiUtil from "../../../utils/api/suppliers-api-utils";
import { useHistory } from "react-router-dom";

const Suppliers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  var mounted = true;



  const onSearch = async (e) => {
    let searchValue = e.target.value;;
    if(searchValue === ""){ // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchSuppliersData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);  //imp to set page number here
    fetchSearchSuppliers(paginationLimit, 1, searchValue);
  }


  const fetchSearchSuppliers = async (pageLimit = 20, pageNumber = 1, searchValue) => {
    const suppliersSearchResponse = await SuppliersApiUtil.searchSuppliers(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('suppliersSearchResponse:', suppliersSearchResponse);
    if (suppliersSearchResponse.hasError) {
      console.log('Cant Search Suppliers -> ', suppliersSearchResponse.errorMessage);
      message.error(suppliersSearchResponse.errorMessage, 2);
      setLoading(false);
    }
    else {
      console.log('res -> ', suppliersSearchResponse.message);
      if (mounted) {     //imp if unmounted
        setData(suppliersSearchResponse.suppliers.data);
        setPaginationData(suppliersSearchResponse.suppliers.page);
        setLoading(false);
      }
    }
    
  }


  const fetchSuppliersData = async (pageLimit = 10, pageNumber = 1) => {
    
    document.getElementById('app-loader-container').style.display = "block";
    const suppliersViewResponse = await SuppliersApiUtil.viewSuppliers(
      pageLimit,
      pageNumber
    );
    console.log("SuppliersViewResponse:", suppliersViewResponse);

    if (suppliersViewResponse.hasError) {
      console.log(
        "Cant fetch suppliers -> ",
        suppliersViewResponse.errorMessage
      );
      //message.error(suppliersViewResponse.errorMessage, 3);   //imp not to show on Ui
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", suppliersViewResponse);
      if (mounted) {     //imp if unmounted
        const suppliersData = suppliersViewResponse.suppliers.data || suppliersViewResponse.suppliers;
        setData(suppliersData);
        message.success(suppliersViewResponse.message, 3);
        setPaginationData(suppliersViewResponse.suppliers.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  };


  useEffect(async () => {
    fetchSuppliersData();
    return () => {
      mounted = false;
    }
  }, []);



  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if(searchedData){   //imp is search data exists
      if (currentPageSearched > Math.ceil(paginationData.totalElements / value)) {
        fetchSearchSuppliers(value, 1, searchedData);
      } else {
        fetchSearchSuppliers(value, currentPageSearched, searchedData);
      }
    }  /*------end of outer if---------*/
    else {
      if (currentPage > Math.ceil(paginationData.totalElements / value)) {
        fetchSuppliersData(value, 1);
      } else {
        fetchSuppliersData(value, currentPage);
      }  /*------end of outer else---------*/
    }

  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchSuppliersData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchSuppliers(paginationLimit, currentPg, searchedData);
  }



  const handleAddSupplier = () => {
    history.push({
      pathname: "/suppliers/add",
    });
  };

  return (
    <div className="page categories">
      <div className="page__header">
        <h1>Suppliers</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={handleAddSupplier}
          className="custom-btn custom-btn--primary"
        >
          Add New
        </Button>
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
              placeholder="search suppliers"
              allowClear
              //enterButton='Search'
              size="large"
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table">
          <EditableSupplier
            pageLimit={paginationLimit}
            tableData={data}
            paginationData={paginationData}
            tableDataLoading={loading}
            onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
            currentPageIndex={searchedData ? currentPageSearched : currentPage}
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Suppliers;
