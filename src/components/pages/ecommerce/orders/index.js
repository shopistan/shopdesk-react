import React, { useEffect, useState } from "react";

import { Tabs, Menu } from "antd";
import { useHistory } from "react-router-dom";

import AllOrders from "./allOrders";
import CompletedOrders from "./completedOrders";
import SaleOrders from "./saleOrders";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

// const OrderMenu = (
//   <Menu>
//     <Menu.Item key="0" onClick={() => history.push({ pathname: "/" })}>
//       Menu Item
//     </Menu.Item>
//     <Menu.Divider />
//     <Menu.Item key="1" onClick={() => history.push({ pathname: "/" })}>
//       Menu Item
//     </Menu.Item>
//     <Menu.Divider />
//     <Menu.Item key="2" onClick={() => history.push({ pathname: "/" })}>
//       Menu Item
//     </Menu.Item>
//     <Menu.Divider />
//   </Menu>
// );

function EcommerceOrders() {
  return (
    <div className="page ecom-orders">
      <div className="page__header">
        <h1>Ecommerce</h1>

        <div className="page__header__buttons"></div>
      </div>

      <div className="page__content">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="All Orders" key="1">
            <AllOrders />
          </TabPane>
          <TabPane tab="Sale Orders" key="2">
            <SaleOrders />
          </TabPane>
          <TabPane tab="Completed Orders" key="3">
            <CompletedOrders />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default EcommerceOrders;
