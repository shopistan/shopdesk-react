import React from "react";
import "../style.scss";

import { DatePicker, Button } from "antd";
import { BarsOutlined } from "@ant-design/icons";

const ProductHistory = () => {
  const { RangePicker } = DatePicker;

  return (
    <div className='page reports'>
      <div className='page__header'>
        <h1>Product History</h1>
      </div>

      <div className='page__content'>
        <div className='action-row'>
          <RangePicker className='date-picker' />
          <Button type='primary' icon={<BarsOutlined />}>
            Fetch
          </Button>
        </div>

        <div className='page__table'>{/* Insert Table Here */}</div>
      </div>
    </div>
  );
};

export default ProductHistory;
