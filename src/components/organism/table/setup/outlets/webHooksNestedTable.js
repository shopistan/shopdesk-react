import React, { useState, useEffect, useLayoutEffect } from "react";
import { Table, Input, InputNumber, Pagination, Form, Typography } from "antd";
import { useHistory } from 'react-router-dom';


const WebHooksNestedTable = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  //const [currentPageNumber, setcurrentPageNumber] = useState(1);
  const history = useHistory();


  const handleDelete = (record) => {
    console.log(record);
    props.onHandleWebHookDelete(record);
  };

  const showTotalItemsBar = (total, range) => {
    return `${range[0]}-${range[1]} of ${total} items`
  };

  /*const handlePageChange = (page, pageSize) => {
     setcurrentPageNumber(page)
     props.onClickPageChanger(page); 
  };*/


  useEffect(async () => {
    setData(props.tableData);
     

  }, [props.tableData, props.tableDataLoading, ]);  /* imp passing props to re-render */

  const columns = [
    {
      title: "Url",
      dataIndex: "url",
      //width: "50%",
    },
    {
      title: "Delete",
      render: (_, record) => {
        return (
          <div className='action-btns'>
            {data.length >= 1 ? (
              <Typography.Link
                onClick={() => handleDelete(record)}
              >
                delete
              </Typography.Link>

            ) : null}
          </div>
        );
      },
    },
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
        title: col.title,
      }),
    };
  });



  return (
    <Form form={form} component={false}>

      <Table
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        className='table-frame'
        pagination={{
          total: data && data.length,
          showTotal: (total, range) => showTotalItemsBar(total, range),
          defaultPageSize: 10,
          pageSize: parseInt(props.pageLimit),
          showSizeChanger: false,
          //current: currentPageNumber,
          //onChange: (page, pageSize) => handlePageChange(page, pageSize),
        }}
        loading={props.tableDataLoading}
        rowKey="id"
      />

    </Form>
  );
};

export default WebHooksNestedTable;

 