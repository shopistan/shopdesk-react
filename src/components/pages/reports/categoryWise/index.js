import React from "react";
import { DatePicker, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CategoryWise = () => {
  const { RangePicker } = DatePicker;

  return (
    <div className='page reports'>
      <div className='page__header'>
        <h1>Category Wise</h1>
      </div>

      <div className='page__content'>
        <div className='action-row'>
          <RangePicker />
          <Button type='primary' icon={<SearchOutlined />}>
            Fetch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWise;
