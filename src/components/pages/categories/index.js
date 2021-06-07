import React, { useState, useEffect } from "react";

import { Button, Select, Input, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableTable from "../../organism/table";
import { useHistory } from "react-router-dom";
import * as CategoriesApiUtil from "../../../utils/api/categories-api-utils";

const Categories = () => {
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
    if(searchValue === ""){    // if empty value
      setSearchedData(null);
      setLoading(true);
      fetchCategoriesData(paginationLimit, currentPage);
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1);    //imp
    fetchSearchCategories(paginationLimit, 1, searchValue);
  }


  const fetchSearchCategories = async (pageLimit = 20, pageNumber = 1, searchValue) => {
    const categoriesSearchResponse = await CategoriesApiUtil.searchCategories(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('categoriesSearchResponse:', categoriesSearchResponse);
    if (categoriesSearchResponse.hasError) {
      console.log('Cant Search Categories -> ', categoriesSearchResponse.errorMessage);
      //message.error(categoriesSearchResponse.errorMessage, 2);     //imp not to show on Ui
      setLoading(false);
    }
    else {
      console.log('res -> ', categoriesSearchResponse.message);
      //message.success(categoriesSearchResponse.message, 2);
      setData(categoriesSearchResponse.categories.data);
      setPaginationData(categoriesSearchResponse.categories.page);
      setLoading(false);
    }

  }



  const fetchCategoriesData = async (pageLimit = 10, pageNumber = 1) => {
   
    document.getElementById('app-loader-container').style.display = "block";
    const categoriesViewResponse = await CategoriesApiUtil.viewCategories(
      pageLimit,
      pageNumber
    );
    console.log("categoriesViewResponse:", categoriesViewResponse);

    if (categoriesViewResponse.hasError) {
      console.log(
        "Cant fetch categories -> ",
        categoriesViewResponse.errorMessage
      );
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", categoriesViewResponse);
      if (mounted) {     //imp if unmounted
        const categoriesData = categoriesViewResponse.categories.data || categoriesViewResponse.categories;
        setData(categoriesData);
        setPaginationData(categoriesViewResponse.categories.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";

      }
    }
  };



  useEffect(async () => {
    fetchCategoriesData();
    return () => {
      mounted = false;
    }
  }, []);



  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if(searchedData){
      if (currentPageSearched > Math.ceil(paginationData.totalElements / value)) {
        fetchSearchCategories(value, 1, searchedData);
      } else {
        fetchSearchCategories(value, currentPageSearched, searchedData);
      }
    }  /*------end of outer if---------*/
    else {
      if (currentPage > Math.ceil(paginationData.totalElements / value)) {
        fetchCategoriesData(value, 1);
      } else {
        fetchCategoriesData(value, currentPage);
      }  /*------end of outer else---------*/
    }

  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCategoriesData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchCategories(paginationLimit, currentPg, searchedData);
  }


  const handleAddCategory = () => {
    history.push({
      pathname: "/categories/add",
    });
  };

  

  return (
    <div className="page categories">
      <div className="page__header">
        <h1>Categories</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddCategory()}
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
              placeholder="search categories"
              allowClear
              //enterButton='Search'
              size="large"
              //onSearch={onSearch}
              onChange={onSearch}
            />
          </div>
        </div>


        {/* Table */}
        <div className="table">
          <EditableTable
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

export default Categories;
