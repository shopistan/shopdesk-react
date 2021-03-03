import React, { useState } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import {
  EditOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { getSingleCustomer } from '../../../../utils/api/customer-api-utils';
import { useEffect } from 'react';

const CustomerProfile = (props) => {
  const { match = {} } = props;
  const { customer_id = {} } = match.params;
  const [customerData, setCustomerData] = useState({});

  const history = useHistory();

  const fetchSingleCustomerData = async (customerId) => {
    if (!customerId) {
      return popPage();
    }
    const singleCustomerDataResponse = await getSingleCustomer(customerId);
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
      id: customerData.id
    };
    setCustomerData(mappedCustomerResponse);
  };

  const popPage = () => {
    history.goBack();
  };

  useEffect(() => {
    fetchSingleCustomerData(customer_id);
  }, []);

  const onPayAcccountBalanceClick = () => {
    history.push(`/customers/${customer_id}/pay-account-balance`);
  };

  const onCustomerCreditHistoryClick = () => {
    history.push(`/customers/${customer_id}/credit-history`);
  };

  console.log(customerData);
  return (
    <div className='page customer-profile'>
      <div className='page__header'>
        <h1>Customer Profile</h1>

        <div className='page__header__buttons'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => {
              history.push(`/customers/${customer_id}/edit`);
            }}
          >
            Edit
          </Button>

          <Button
            type='primary'
            icon={<DeleteOutlined />}
            onClick={() => {
              history.push(`/customers/${customer_id}/delete`);
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className='page__content'>
        <div className='info'>
          <ul>
            <li>
              <span>Name:</span>
              <span>{customerData.name ? customerData.name : ''}</span>
            </li>
            <li>
              <span>Phone:</span>
              <span>{customerData.phone ? customerData.phone : ''}</span>
            </li>
            <li>
              <span>Email:</span>
              <span>{customerData.email ? customerData.email : ''}</span>
            </li>
            <li>
              <span>Sex:</span>
              <span>{customerData.gender ? customerData.gender : ''}</span>
            </li>
            <li>
              <span>Balance:</span>
              <span>{customerData.balance ? customerData.balance : ''}</span>
            </li>
            <li>
              <span>Code:</span>
              <span>{customerData.code ? customerData.code : ''}</span>
            </li>
          </ul>
        </div>

        <div className='links'>
          <ul>
            <li>
              <a href='#' className='link' onClick={onCustomerCreditHistoryClick} >
                <HistoryOutlined />
                View Credit History
              </a>
            </li>
            <li>
              <a href='#' className='link' onClick={onPayAcccountBalanceClick}>
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
