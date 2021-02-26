import React from "react";

import { Timeline } from "antd";
import {
  EditOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const CustomerHistory = () => {
  return (
    <div className="page customer-profile">
      <div className="page__header">
        <h1>Customer Credit History</h1>
      </div>

      <div className="page__content">
        <Timeline mode="left">
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
          <Timeline.Item label="2015-09-01 09:12:11">
            Solve initial network problems
          </Timeline.Item>
          <Timeline.Item>Technical testing</Timeline.Item>
          <Timeline.Item label="2015-09-01 09:12:11">
            Network problems being solved
          </Timeline.Item>
        </Timeline>
      </div>
    </div>
  );
};

export default CustomerHistory;
