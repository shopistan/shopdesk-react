import React, { useState } from "react";
import "./style.scss";
import { useHistory } from "react-router-dom";
import { Button, Row, Col } from "antd";
import {
  EditOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import { getSingleCustomer } from "../../../../utils/api/customer-api-utils";
import { useEffect } from "react";

const CustomerProfile = (props) => {
  const { match = {} } = props;
  const { customer_id = {} } = match.params;
  const [customerData, setCustomerData] = useState({});

  const history = useHistory();

  const fetchSingleCustomerData = async (customerId) => {
    if (!customerId) {
      return popPage();
    }

    document.getElementById('app-loader-container').style.display = "block";
    const singleCustomerDataResponse = await getSingleCustomer(customerId);
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

  const popPage = () => {
    history.goBack();
  };

  useEffect(() => {
    fetchSingleCustomerData(customer_id);
  }, []);

  const onPayAcccountBalanceClick = (e) => {
    e.preventDefault();
    history.push(`/customers/${customer_id}/pay-account-balance`);
  };

  const onCustomerCreditHistoryClick = (e) => {
    e.preventDefault();
    history.push(`/customers/${customer_id}/credit-history`);
  };

  const handleCancel = () => {
    history.goBack();
  };



  return (
    <div className="page customer-profile">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Customer Profile</h1>

        <div className="page__header__buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              history.push(`/customers/${customer_id}/edit`);
            }}
            className="custom-btn custom-btn--primary"
          >
            Edit
          </Button>

          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => {
              history.push(`/customers/${customer_id}/delete`);
            }}
            className="custom-btn custom-btn--primary"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="page__content">

        <Row>
          <Col xs={24} sm={24} md={24} lg={12} className="customer-details-section">
            <div className="info">
              <ul>
                <li>
                  <span>Name:</span>
                  <span>{customerData.name ? customerData.name : ""}</span>
                </li>
                <li>
                  <span>Phone:</span>
                  <span>{customerData.phone ? customerData.phone : ""}</span>
                </li>
                <li>
                  <span>Email:</span>
                  <span>{customerData.email ? customerData.email : ""}</span>
                </li>
                <li>
                  <span>Sex:</span>
                  <span>{customerData.gender ? customerData.gender : ""}</span>
                </li>
                <li>
                  <span>Balance:</span>
                  <span>{customerData.balance ? parseFloat(customerData.balance).toFixed(2) : ""}</span>
                </li>
                <li>
                  <span>Code:</span>
                  <span>{customerData.code ? customerData.code : ""}</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} >
            <div className="links">
              <ul>
                <li>
                  <a
                    className="link"
                    onClick={onCustomerCreditHistoryClick}
                  >
                    <HistoryOutlined />
                View Credit History
              </a>
                </li>
                <li>
                  <a className="link" onClick={onPayAcccountBalanceClick}>
                    <CreditCardOutlined />
                Pay Account Balance
              </a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>


      </div>
    </div>
  );
};

export default CustomerProfile;
