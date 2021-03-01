import React from "react";
import "./style.scss";

import { Button } from "antd";
import {
  EditOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const CustomerProfile = () => {
  return (
    <div className="page customer-profile">
      <div className="page__header">
        <h1>Customer Profile</h1>

        <div className="page__header__buttons">
          <Button type="primary" icon={<EditOutlined />}>
            Edit
          </Button>

          <Button type="primary" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </div>
      </div>

      <div className="page__content">
        <div className="info">
          <ul>
            <li>
              <span>Name:</span>
              <span>Insert Name</span>
            </li>
            <li>
              <span>Phone:</span>
              <span>090078601</span>
            </li>
            <li>
              <span>Email:</span>
              <span>a@b.com</span>
            </li>
            <li>
              <span>Sex:</span>
              <span>Male</span>
            </li>
            <li>
              <span>Balance:</span>
              <span>5154 Rs</span>
            </li>
            <li>
              <span>Code:</span>
              <span>123</span>
            </li>
          </ul>
        </div>

        <div className="links">
          <ul>
            <li>
              <a href="#" className="link">
                <HistoryOutlined />
                View Credit History
              </a>
            </li>
            <li>
              <a href="#" className="link">
                <CreditCardOutlined />
                Pay Account Balance
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
