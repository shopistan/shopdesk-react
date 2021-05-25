import React, { useState, useEffect } from "react";

import { Button, Form, Input, Select, message, Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import {
  getSingleCustomer,
  rechargeCustomerAccount,
} from "../../../../utils/api/customer-api-utils";



const CustomerPay = (props) => {
  const { Option } = Select;
  const [buttonDisabled, setButtonDisabled] = useState(false);

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

    document.getElementById('app-loader-container').style.display = "block";
    const singleCustomerDataResponse = await getSingleCustomer(customerId);
    console.log("singleCustomerDataResponse:  ", singleCustomerDataResponse);
    if (singleCustomerDataResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
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
    document.getElementById('app-loader-container').style.display = "none";
  };

  function handleChange(value) {
    //console.log(`selected ${value}`);
  }

  const onNewBalanceSubmitted = async (values) => {
    //console.log("onNewBalanceSubmitted: ", values);
    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    const paymentInfo = {
      type: values.payment_type,
      amount: values.payment_amount,
    };

    document.getElementById('app-loader-container').style.display = "block";
    const customerRechargeResponse = await rechargeCustomerAccount(
      customerData,
      paymentInfo
    );

    if (customerRechargeResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      setButtonDisabled(false);
      return message.error("Cannot recharge user account!", 3);
    }

    /*message.success(
      customerRechargeResponse.message
        ? customerRechargeResponse.message
        : "Balance successfully updated!",
      3
    );*/

    message.success("Customer Amount Addded!", 3);

    document.getElementById('app-loader-container').style.display = "none";
    history.push(`/customers/${customer_id}/view`);

  };


  const handleCancel = () => {
    history.goBack();
};

  return (
    <div className="page customer-profile">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel} />Pay Account Balance</h1>
      </div>

      <div className="page__content">

        <Row>
          <Col xs={24} sm={24} md={24} lg={16} className="customer-details-section">
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
          </Col>


          <Col xs={24} sm={24} md={24} lg={8}>
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
                      <Select //defaultValue="Cash"
                      placeholder="Select Payment Method"
                        onChange={handleChange}>
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
                  <Button type="secondary" onClick={handleCancel}>
                    Cancel
              </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="custom-btn custom-btn--primary"
                    disabled={buttonDisabled}
                  >
                    Save
              </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomerPay;
