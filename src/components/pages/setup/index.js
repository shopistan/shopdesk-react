import React from "react";

import { Tabs } from "antd";
import Outlets from "./outlets";
import Receipts from "./receipt";
import Users from "./users";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

function Setup() {
  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Setup</h1>
      </div>

      <div className="page__content">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Outlets" key="1">
            <Outlets />
          </TabPane>
          <TabPane tab="Users" key="2">
            <Users />
          </TabPane>
          <TabPane tab="Receipt Templates" key="3">
            <Receipts />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Setup;
