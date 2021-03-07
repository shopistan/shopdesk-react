import React, { useState, useEffect } from "react";

import { Button, Form, Input, Select, message } from "antd";
import { useHistory } from "react-router-dom";
import {} from "@ant-design/icons";

import {
  getSingleCustomer,
  rechargeCustomerAccount,
} from "../../../../utils/api/customer-api-utils";

const CustomerPay = (props) => {
  const { Option } = Select;

  const { match = {} } = props;
  const { customer_id = {} } = match.params;

  //These are used to set data in the ant form
  const [customerData, setCustomerData] = useState({});

  const history = useHistory();

  useEffect(() => {
    fetchSingleCustomerData(customer_id);
  }, []);

  const popPage = () => {
    history.goBack();
  };

  const fetchSingleCustomerData = async (customerId) => {
    if (!customerId) {
      return popPage();
    }
    const singleCustomerDataResponse = await getSingleCustomer(customerId);
    console.log("singleCustomerDataResponse:  ", singleCustomerDataResponse);
    if (singleCustomerDataResponse.hasError) {
      return popPage();
    }
    const customerData = singleCustomerDataResponse.customer;

    const mappedCustomerResponse = {
      balance: customerData.balance,
      code: customerData.customer_code,
      email: customerData.customer_email,
      name: customerData.customer_name,
      phone: customerData.customer_phone,
      gender: customerData.customer_sex,
      id: customerData.id,
    };
    setCustomerData(mappedCustomerResponse);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const onNewBalanceSubmitted = async (values) => {
    console.log("onNewBalanceSubmitted: ", values);
    const paymentInfo = {
      type: values.payment_type,
      amount: values.payment_amount,
    };

    const customerRechargeResponse = await rechargeCustomerAccount(
      customerData,
      paymentInfo
    );

    if (customerRechargeResponse.hasError) {
      return message.error("Cannot recharge user account!", 3);
    }

    message.success(
      customerRechargeResponse.message
        ? customerRechargeResponse.message
        : "Balance successfully updated!",
      3
    );
    history.push(`/customers/${customer_id}/view`);
  };

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
              <span>{customerData.name}</span>
            </li>
            <li>
              <span>Phone:</span>
              <span>{customerData.phone}</span>
            </li>
            <li>
              <span>Email:</span>
              <span>{customerData.email}</span>
            </li>
            <li>
              <span>Sex:</span>
              <span>{customerData.gender}</span>
            </li>
            <li>
              <span>Balance:</span>
              <span>{customerData.balance}</span>
            </li>
            <li>
              <span>Code:</span>
              <span>{customerData.code}</span>
            </li>
          </ul>
        </div>

        <div className="page__form">
          <Form
            name="basic"
            layout="vertical"
            onFinish={onNewBalanceSubmitted}
            initialValues={{
              remember: true,
            }}
          >
            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Payment Type"
                  name="payment_type"
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
                  name="payment_amount"
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

              <Button
                type="primary"
                htmlType="submit"
                className="custom-btn custom-btn--primary"
              >
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
