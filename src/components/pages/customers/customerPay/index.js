import React from "react";

import { Button, Form, Input, Select } from "antd";
import {} from "@ant-design/icons";

const CustomerPay = () => {
  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div className="page customer-profile">
      <div className="page__header">
        <h1>Pay Account Balance</h1>
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

        <div className="page__form">
          <Form
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
          >
            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Payment Type"
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: "Please select payment type!",
                    },
                  ]}
                >
                  <Select defaultValue="Cash" onChange={handleChange}>
                    <Option value="cash">Cash</Option>
                    <Option value="credit card">Credit Card</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message: "Please input amount!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="form__row--footer">
              <Button type="secondary" htmlType="submit">
                Cancel
              </Button>

              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerPay;
