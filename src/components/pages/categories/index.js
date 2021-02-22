import React, {useState, useEffect} from "react";

import { Button, Select, Input } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableTable from "../../organism/table";
import { useHistory } from 'react-router-dom';
import * as CategoriesApiUtil from '../../../utils/api/categories-api-utils';


const Categories = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  const onSearch = async (e) => {
    const currValue = e.target.value;
    if(currValue === "") {
      const result = await fetchCategoriesData();
      if (result.hasError) {
        console.log('Cant fetch categories -> ', result.errorMessage);
      }
      else {
        console.log('res -> ', result);
        setData(result.categories.data);
        setLoading(false);
      }
    } 
    else {
      const filteredData = data.filter((entry) => {
      var item_name = entry.category_name;
      item_name= item_name.toLowerCase();
      console.log(item_name);
      return item_name.includes(currValue.toLowerCase())
      });
      setData(filteredData);
    }
  }

  const fetchCategoriesData =  async ()  => {
    const categoriesViewResponse = await CategoriesApiUtil.viewCategories({});
    console.log('categoriesViewResponse:', categoriesViewResponse)
    return categoriesViewResponse;
  }

  useEffect( async () => {
    const result = await fetchCategoriesData();
    if (result.hasError) {
      console.log('Cant fetch categories -> ', result.errorMessage);
    }
    else {
      console.log('res -> ', result);
      setData(result.categories.data);
      setLoading(false);
    }

  }, []);


  function handleChange(value) {
    console.log(`selected ${value}`);
    setPaginationLimit(value);
  }

  const handleAddCategory = () => {
    history.push({
      pathname: '/categories/add',
    });
  };

  return (
    <div className='page categories'>
      <div className='page__header'>
        <h2>Categories</h2>
        <Button type='primary' icon={<PlusCircleOutlined />}
          onClick={() => handleAddCategory()}>
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
              onChange= {onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table'>
          <EditableTable pageLimit={paginationLimit} tableData={data} tableDataLoading={loading} />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Categories;
