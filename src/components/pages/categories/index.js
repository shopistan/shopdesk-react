import React, { useState, useEffect } from "react";

import { Button, Select, Input } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableTable from "../../organism/table";
import { useHistory } from "react-router-dom";
import * as CategoriesApiUtil from "../../../utils/api/categories-api-utils";

const Categories = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataSearched, setDataSearched] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  var mounted = true;

  const onSearch = async (e) => {
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setLoading(true);
      fetchCategoriesData(paginationLimit, currentPage);
    } else {
      const filteredData = dataSearched.filter((entry) => {
        var item_name = entry.category_name;
        item_name = item_name.toLowerCase();
        return item_name.includes(currValue);
      });
      setData(filteredData);
      paginationData.totalElements = filteredData.length;
      setPaginationData(paginationData);
      setPaginationLimit(paginationLimit);
    }
  };

  const fetchCategoriesData = async (pageLimit = 10, pageNumber = 1) => {
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
    } else {
      console.log("res -> ", categoriesViewResponse);
      if (mounted) {     //imp if unmounted
        const categoriesData = categoriesViewResponse.categories.data || categoriesViewResponse.categories;
        /*----------handle data serching response------------*/
        handledSearchedDataResponse(categoriesData);
        /*-----------handle data serching response-----------*/
        setData(categoriesData);
        setPaginationData(categoriesViewResponse.categories.page || {});
        setLoading(false);
      }
    }
  };



  function handledSearchedDataResponse(dataResponse) {
    var newData = [...dataSearched];
    dataResponse.forEach(item => {
      var foundObj = newData.find(obj => {
        return obj.category_id === item.category_id;
      });

      if(!foundObj){
        newData.push(item);
      }
    });
    //console.log(newData);
    setDataSearched(newData);
  }



  useEffect(async () => {
    fetchCategoriesData();
    return () => {
      mounted = false;
    }
  }, []);

  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchCategoriesData(value, 1);
    } else {
      fetchCategoriesData(value, currentPage);
    }
  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCategoriesData(paginationLimit, currentPg);
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
            onClickPageChanger={handlePageChange}
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Categories;
