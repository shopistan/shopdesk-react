import React, { useState, useEffect } from 'react';

import { Button, Select, Input, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import CustomerTable from '../../organism/table/customerTable';
import { useHistory } from 'react-router-dom';

import * as CustomersApiUtil from '../../../utils/api/customer-api-utils';

const Customers = () => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const history = useHistory();

  const fetchCustomersData = async (pageLimit = 10, pageNumber = 1) => {
    const customersViewResponse = await CustomersApiUtil.viewCustomers(
      pageNumber
    );
    console.log('customers view response:', customersViewResponse);

    if (customersViewResponse.hasError) {
      console.log(
        'Cant fetch customers -> ',
        customersViewResponse.errorMessage
      );
      setLoading(false);
    } else {
      console.log('res -> ', customersViewResponse);
      message.success(customersViewResponse.message, 3);
      setData(customersViewResponse.Customer.data);
      
      setLoading(false);
    }
  };

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCustomersData(paginationLimit, currentPg);
  }

  useEffect(() => {
    fetchCustomersData();
  }, []);

  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Customers</h1>

        <div className='page__header__buttons'>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => {
              history.push('/customers/add');
            }}
          >
            Add New
          </Button>

          <Button type='primary'>Fetch All</Button>

          <Button type='primary'>Export CSV</Button>
        </div>
      </div>
      <div className='page__content'>
        {/* Table */}
        <div className='table'>
          <CustomerTable
            pageLimit={paginationLimit}
            tableData={data}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
            currentPageIndex={currentPage}
          />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Customers;
