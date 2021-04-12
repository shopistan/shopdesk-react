import React from "react";

import { Input, Button } from "antd";
import "../../style.scss";

const { Search } = Input;

function AllOrders() {
  return (
    <div className="allOrders">
      <div className="search">
        <Button type="primary">Make Invoice</Button>
        <Search
          placeholder="search all orders"
          allowClear
          //enterButton='Search'

          style={{ width: 300 }}
          //onSearch={onSearch}
          // onChange={onSearch}
        />
      </div>

      <div className="table"></div>
    </div>
  );
}

export default AllOrders;
