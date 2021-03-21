import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Table, Input, InputNumber, Pagination, Form, Typography } from 'antd';
import { useHistory } from 'react-router-dom';

const CustomersTable = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [currentPageNumber, setcurrentPageNumber] = useState(1);
  const history = useHistory();

  const handleEdit = (record) => {
    console.log(record);
    history.push({
      pathname: `/customers/${record.customer_id}/view`,
      data: record // your data array of objects
    });
  };

  const showTotalItemsBar = (total, range) => {
    console.log(range);
    return `${range[0]}-${range[1]} of ${total} items`;
  };

  const handlePageChange = (page, pageSize) => {
    setcurrentPageNumber(page);
    props.onClickPageChanger(page);
  };

  useEffect(() => {
    setData(props.tableData);
    setcurrentPageNumber(props.currentPageIndex);
  }, [
    props.tableData,
    props.tableDataLoading,
    props.currentPageIndex
  ]); /* imp passing props to re-render */

  // customer_name: "Khizer Younas"
  // customer_phone: "3215409910"
  // customer_email: "m.khizeryounas@gmail.com"
  // balance: "-50200"

  //currently not displayed
  // customer_id: "413"
  // customer_sex: "Male"

  const columns = [
    {
      title: 'Name',
      dataIndex: 'customer_name',
      width: '50%',
      responsive: ['sm']
    },
    {
      title: 'Phone',
      dataIndex: 'customer_phone',
      responsive: ['sm']
    },
    {
      title: 'Email',
      dataIndex: 'customer_email',
      responsive: ['sm']
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      responsive: ['sm']
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      responsive: ['sm'],
      render: (_, record) => {
        return (
          <div className='action-btns'>
            <Typography.Link onClick={() => handleEdit(record)}>
              Edit
            </Typography.Link>
          </div>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,

        dataindex: col.dataIndex,
        title: col.title
      })
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        bordered
        dataSource={data}
        columns={mergedColumns}
        id={props.tableId} //imp to pass table id here
        rowClassName='editable-row'
        className='table-frame'
        pagination={{
          total: data && data.length,
          showTotal: (total, range) => showTotalItemsBar(total, range),
          defaultPageSize: 10,
          pageSize: parseInt(props.pageLimit),
          showSizeChanger: false,
          current: currentPageNumber,
          onChange: (page, pageSize) => handlePageChange(page, pageSize)
        }}
        loading={props.tableDataLoading}
      />
    </Form>
  );
};

export default CustomersTable;
