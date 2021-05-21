import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import TaxesViewTable from "../../organism/table/taxesTable";
import { useHistory } from "react-router-dom";
import * as TaxApiUtil from "../../../utils/api/tax-api-utils";

const Taxes = () => {
  const history = useHistory();
  const { Search } = Input;

  const [paginationLimit, setPaginationLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const { Option } = Select;


  var mounted = true;


  const onSearch = async (e) => {
    let searchValue = e.target.value;;
    if(searchValue === ""){ // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchTaxesData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);  //imp to set page no here
    fetchSearchTaxes(paginationLimit, 1, searchValue);
  }



  const fetchSearchTaxes = async (pageLimit = 20, pageNumber = 1, searchValue) => {
    const taxesSearchResponse = await TaxApiUtil.searchTaxes(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('taxesSearchResponse:', taxesSearchResponse);
    if (taxesSearchResponse.hasError) {
      console.log('Cant Search Taxes -> ', taxesSearchResponse.errorMessage);
      message.error(taxesSearchResponse.errorMessage, 2);
      setLoading(false);
    }
    else {
      console.log('res -> ', taxesSearchResponse.message);
      if (mounted) {     //imp if unmounted
        setData(taxesSearchResponse.taxes.data);
        setPaginationData(taxesSearchResponse.taxes.page);
        setLoading(false);
      }
    }
    
  }



  const fetchTaxesData = async (pageLimit = 10, pageNumber = 1) => {
    const taxesViewResponse = await TaxApiUtil.viewTaxes(pageLimit, pageNumber);
    console.log("taxesViewResponse:", taxesViewResponse);

    if (taxesViewResponse.hasError) {
      console.log("Cant fetch taxes -> ", taxesViewResponse.errorMessage);
      //message.error(taxesViewResponse.errorMessage, 3);
      setLoading(false);
    } else {
      console.log("res -> ", taxesViewResponse);
      if (mounted) {     //imp if unmounted
        const taxesData = taxesViewResponse.taxes.data || taxesViewResponse.taxes;
        setData(taxesData);
        message.success(taxesViewResponse.message, 3);
        setPaginationData(taxesViewResponse.taxes.page || {});
        setLoading(false);
      }
    }
  };



  useEffect(async () => {
    fetchTaxesData();
    return () => {
      mounted = false;
    }
  }, []);



  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if(searchedData){   //imp is search data exists
      if (currentPageSearched > Math.ceil(paginationData.totalElements / value)) {
        fetchSearchTaxes(value, 1, searchedData);
      } else {
        fetchSearchTaxes(value, currentPageSearched, searchedData);
      }
    }  /*------end of outer if---------*/
    else {
      if (currentPage > Math.ceil(paginationData.totalElements / value)) {
        fetchTaxesData(value, 1);
      } else {
        fetchTaxesData(value, currentPage);
      }  /*------end of outer else---------*/
    }

  }


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchTaxesData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchTaxes(paginationLimit, currentPg, searchedData);
  }



  const handleAddTaxes = () => {
    history.push({
      pathname: "/taxes/add",
    });
  };

  return (
    <div className="page categories">
      <div className="page__header">
        <h1>Taxes</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={handleAddTaxes}
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
              placeholder="search taxes"
              allowClear
              size="large"
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table">
          <TaxesViewTable
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

export default Taxes;
