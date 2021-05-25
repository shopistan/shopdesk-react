import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableCouriers from "../../organism/table/couriersTable";
import { useHistory } from "react-router-dom";
import * as CouriersApiUtil from "../../../utils/api/couriers-api-utils";

const Couriers = () => {
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
      fetchCouriersData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);
    fetchSearchCouriers(paginationLimit, 1, searchValue);
   
  }


  const fetchSearchCouriers = async (pageLimit = 20, pageNumber = 1, searchValue) => {
    const couriersSearchResponse = await CouriersApiUtil.searchCouriers(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('couriersSearchResponse:', couriersSearchResponse);
    if (couriersSearchResponse.hasError) {
      console.log('Cant Search Couriers -> ', couriersSearchResponse.errorMessage);
      message.error(couriersSearchResponse.errorMessage, 2);
      setLoading(false);
    }
    else {
      console.log('res -> ', couriersSearchResponse.message);
      if (mounted) {     //imp if unmounted
        setData(couriersSearchResponse.courier.data);
        setPaginationData(couriersSearchResponse.courier.page);
        setLoading(false);
      }
    }
    
  }



  const fetchCouriersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const couriersViewResponse = await CouriersApiUtil.viewCouriers(
      pageLimit,
      pageNumber
    );
    console.log("couriersViewResponse:", couriersViewResponse);

    if (couriersViewResponse.hasError) {
      console.log("Cant fetch couriers -> ", couriersViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", couriersViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(couriersViewResponse.message, 3);
        const couriersData = couriersViewResponse.courier.data || couriersViewResponse.courier;
        setData(couriersData);
        setPaginationData(couriersViewResponse.courier.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  };



  useEffect(() => {
    fetchCouriersData();
    return () => {
      mounted = false;
    }
  }, []);



  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if(searchedData){   //imp is search data exists
      if (currentPageSearched > Math.ceil(paginationData.totalElements / value)) {
        fetchSearchCouriers(value, 1, searchedData);
      } else {
        fetchSearchCouriers(value, currentPageSearched, searchedData);
      }
    }  /*------end of outer if---------*/
    else {
      if (currentPage > Math.ceil(paginationData.totalElements / value)) {
        fetchCouriersData(value, 1);
      } else {
        fetchCouriersData(value, currentPage);
      }  /*------end of outer else---------*/
    }

  }


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCouriersData(paginationLimit, currentPg);
  }
  

  function handleSearchedDataPageChange(currentPg) {
    console.log("sechedpage");
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchCouriers(paginationLimit, currentPg, searchedData);
  }



  const handleAddCourier = () => {
    history.push({
      pathname: "/couriers/add",
    });
  };

  return (
    <div className="page categories">
      <div className="page__header">
        <h1>Couriers</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddCourier()}
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
              placeholder="search couriers"
              allowClear
              //enterButton='Search'
              size="large"
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table">
          <EditableCouriers
            pageLimit={paginationLimit}
            tableData={data}
            tableDataLoading={loading}
            onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
            currentPageIndex={searchedData ? currentPageSearched : currentPage}
            paginationData={paginationData}
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Couriers;
