import React, {useState, useEffect} from "react";

import { Button, Select, Input } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditableTable from "../../organism/table";
import { useHistory } from 'react-router-dom';
import { getCategories } from "../../../utils/APIGeneric/DataRequests";

const Categories = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [data, setData] = useState([]);
  const { Option } = Select;

  const history = useHistory();

  const { Search } = Input;

  const onSearch = async (e) => {
    const currValue = e.target.value;
    if(currValue === "") {
      const result = await fetchCategoriesData();
      if (result.fail) {
        console.log('Cant fetch -> ', result);
      }
      else {
        console.log('res -> ', result);
        setData(result.categories);
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
    const res = await getCategories();
    return res;
  }

  useEffect( async () => {
    const result = await fetchCategoriesData();
    if (result.fail) {
      console.log('Cant fetch -> ', result);
    }
    else {
      console.log('res -> ', result);
      setData(result.categories);
    }
  }, []);
  
  const history = useHistory();

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
          <EditableTable pageLimit={paginationLimit} tableData={data} />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Categories;
