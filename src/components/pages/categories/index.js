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
  const [paginationData, setPaginationData] = useState({});
  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  const onSearch = async (e) => {
    const currValue = e.target.value;
    if (currValue === "") {
      fetchCategoriesData(paginationLimit, currentPage);
    } else {
      const filteredData = data.filter((entry) => {
        var item_name = entry.category_name;
        item_name = item_name.toLowerCase();
        return item_name.includes(currValue.toLowerCase());
      });
      setData(filteredData);
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
      setData(categoriesViewResponse.categories.data);
      setPaginationData(categoriesViewResponse.categories.page);
      setLoading(false);
    }
  };

  useEffect(async () => {
    fetchCategoriesData();
  }, []);

  function handleChange(value) {
    setPaginationLimit(value);
    //setCurrentPage(1);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchCategoriesData(value, 1);
    }
    else {
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
    <div className='page categories'>
      <div className='page__header'>
        <h1>Categories</h1>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddCategory()}
        >
          Add New
        </Button>
      </div>
      <div className='page__content'>
        <div className='action-row'>
          <div className='action-row__element'>
            Show
            <Select
              defaultValue='10'
              style={{ width: 120, margin: "0 5px" }}
              onChange={handleChange}
            >
              <Option value='10'>10</Option>
              <Option value='20'>20</Option>
              <Option value='50'>50</Option>
              <Option value='100'>100</Option>
            </Select>
            entries
          </div>

          <div className='action-row__element'>
            <Search
              placeholder='search category'
              allowClear
              //enterButton='Search'
              size='large'
              //onSearch={onSearch}
              onChange={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table'>
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
