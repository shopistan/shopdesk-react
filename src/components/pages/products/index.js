import React from "react";

import { Button, Select, Input } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import EditableTable from "../../organism/table";
import { useHistory } from "react-router-dom";

const Products = () => {
  const { Option } = Select;
  const { Search } = Input;
  const history = useHistory();

  const onSearch = (value) => console.log(value);

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Products</h1>

        <div className='page__header__buttons'>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => {
              history.push("/products/add");
            }}
          >
            Add New
          </Button>
        </div>
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
              <Option value='25'>25</Option>
              <Option value='50'>50</Option>
              <Option value='100'>100</Option>
            </Select>
            entries
          </div>

          <div className='action-row__element'>
            <Search
              placeholder='search product'
              allowClear
              enterButton='Search'
              size='large'
              onSearch={onSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className='table'>
          <EditableTable />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Products;