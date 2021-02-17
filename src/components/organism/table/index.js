import React, { useState, useEffect, useLayoutEffect } from "react";
import { Table, Input, InputNumber, Pagination, Form, Typography } from "antd";
import { getCategories } from "../../../utils/APIGeneric/DataRequests";
import { useHistory } from 'react-router-dom';


const EditableTable = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataLoading, setTableLoading] = useState(true);
  const history = useHistory();

  const handleDelete = (record) => {
    console.log(record);
    history.push({
      pathname: `/categories/${record.category_id}/delete`,
      data: record // your data array of objects
    });
  };

  const edit = (record) => {
    console.log(record);
    history.push({
      pathname:  `/categories/${record.category_id}/edit`,
      data: record // your data array of objects
    });
  };


  const showTotalItemsBar = (total, range) => {
    console.log(range);
    return `${range[0]}-${range[1]} of ${total} items`
  };

  useEffect( async () => {
    const res = await getCategories();
    if (res.fail) {
      console.log('Cant fetch -> ', res);
    }
    else {
      console.log('res -> ', res);
      setData(res.categories);
      setTableLoading(false);
    }

  }, [props.pageLimit]);

  const columns = [
    {
      title: "CategoryName",
      dataIndex: "category_name",
      width: "50%",
      editable: true,
      responsive: ['sm'],
    },
    {
      title: "operation",
      dataIndex: "operation",
      responsive: ['sm'],
      render: (_, record) => {
        return (
          <div className='action-btns'>
            <Typography.Link
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
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
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
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
          total: data.length,
          showTotal: (total, range) => showTotalItemsBar(total, range),
          defaultPageSize: 10,
          pageSize: parseInt(props.pageLimit),
          showSizeChanger: false
        }} 
        loading={dataLoading}
      />

    </Form>
  );
};

export default EditableTable;

