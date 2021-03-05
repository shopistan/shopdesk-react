import React from "react";

import { Button, Tabs, Select, Input, message, Menu, Dropdown } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

function Stock() {
  const history = useHistory();

  const OptionsDropdown = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={() => history.push({ pathname: "stock/order" })}
      >
        <a>Order Stock</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        onClick={() => history.push({ pathname: "products/upload" })}
      >
        Return Stock
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        onClick={() => history.push({ pathname: "products/lookup" })}
      >
        Transfer Inventory
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="2"
        onClick={() => history.push({ pathname: "products/discount" })}
      >
        Stock Adjustment
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Stock Control</h1>

        <div className="page__header__buttons">
          <Dropdown overlay={OptionsDropdown} trigger={["click"]}>
            <Button
              type="Default"
              icon={<ProfileOutlined />}
              onClick={(e) => e.preventDefault()}
            >
              More
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="page__content">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Purchase Orders" key="1">
            <h2>Purchase Orders</h2>
          </TabPane>
          <TabPane tab="Inventory Transfers" key="2">
            <h2>Inventory Transfers</h2>
          </TabPane>
          <TabPane tab="Stock Adjustment" key="3">
            <h2>Stock Adjustment</h2>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Stock;
