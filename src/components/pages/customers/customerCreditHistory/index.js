import React, { useEffect, useState } from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { customerCreditDetails } from '../../../../utils/api/customer-api-utils';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';

const CustomerCreditHistory = (props) => {
  const [customerData, setCustomerData] = useState(null);
  const [creditsHistory, setCreditsHistory] = useState([]);

  const { match = {} } = props;
  const { customer_id = {} } = match.params;

  const history = useHistory();

  const popPage = () => {
    history.goBack();
  };

  const fetchCustomerCreditHistory = async (customerId) => {
    if (!customerId) {
      return popPage();
    }
    const customerCreditHistoryResponse = await customerCreditDetails(
      customerId
    );
    if (customerCreditHistoryResponse.hasError) {
      message.success(customerCreditHistoryResponse.message, 3);
      return popPage();
    }

    const customerData = customerCreditHistoryResponse.customer;
    const creditsHistoryData = customerCreditHistoryResponse.history;

    if (!customerData) {
      message.error('Customer not found');
      return popPage();
    } else if (!creditsHistoryData) {
      message.error('Credits history data not found');
      return popPage();
    }
    setCustomerData(customerData);
    setCreditsHistory(creditsHistoryData);
    console.log('creditsHistoryData:  ', creditsHistoryData);
    console.log('customerData:  ', customerData);
  };

  useEffect(() => {
    fetchCustomerCreditHistory(customer_id);
  }, []);

  return (
    <div className='page customer-profile'>
      <div className='page__header'>
        <h1>Customer Credit History</h1>
      </div>

      <div className='page__content'>
        <VerticalTimeline>
          {creditsHistory.map((singleCreditHistory) => {
            const totalBalance = +singleCreditHistory.balance;
            const invoiceId = singleCreditHistory.invoice_show_id
              ? singleCreditHistory.invoice_show_id
              : '';
            if (isNaN(totalBalance)) {
              return null;
            }

            const balance = Math.abs(totalBalance);
            const isInvoiceData = totalBalance < 0;
            const storeName = singleCreditHistory.store_name;
            const paymentMethod = singleCreditHistory.method;
            const creditDateTime = singleCreditHistory.date;

            const colorOfCircle = isInvoiceData ? 'red' : 'green';
            let messageForCurrentCredit;

            messageForCurrentCredit += customerData.customer_name + ' ';
            if (isInvoiceData) {
              messageForCurrentCredit += `invoice # ${invoiceId} `;
            }
            messageForCurrentCredit += `of PK Rs. ${balance}`;
            if (isInvoiceData) {
              messageForCurrentCredit += '';
            }

            return (
              <VerticalTimelineElement
                className='vertical-timeline-element--work'
                contentStyle={{ background: '#f5f5f6', color: '#black' }}
                contentArrowStyle={{ borderRight: '7px solid  #f5f5f6' }}
                date={creditDateTime}
                iconStyle={{ background: colorOfCircle }}
              >
                {/* <h3 className='vertical-timeline-element-title'></h3> */}
                <h4 className='vertical-timeline-element-subtitle'>
                  {customerData.customer_name} {isInvoiceData ? invoiceId : ''}{' '}
                  {`invoice # ${invoiceId}`} of PK Rs. {balance}{' '}
                  {isInvoiceData
                    ? `payed through account balance at outlet ${storeName}`
                    : ''}
                </h4>
              </VerticalTimelineElement>
            );
          })}

          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentStyle={{ background: '#f5f5f6', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  black' }}
            date='2011 - present'
            iconStyle={{ background: '#f5f5f6', color: '#fff' }}
          >
            <h3 className='vertical-timeline-element-title'>
              Creative Director
            </h3>
            <h4 className='vertical-timeline-element-subtitle'>Miami, FL</h4>
            <p>
              Creative Direction, User Experience, Visual Design, Project
              Management, Team Leading
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default CustomerCreditHistory;
