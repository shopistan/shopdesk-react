import React, { useState, useEffect, useLayoutEffect } from "react";
import { Table, Input, InputNumber, Pagination, Form, Typography } from "antd";
import { useHistory } from "react-router-dom";

const CouriersTable = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [currentPageNumber, setcurrentPageNumber] = useState(1);
  const history = useHistory();

  const handleDelete = (record) => {
    console.log(record);
    history.push({
      pathname: `/couriers/${record.courier_id}/delete`,
      data: record, // your data array of objects
    });
  };

  const edit = (record) => {
    console.log(record);
    history.push({
      pathname: `/couriers/${record.courier_id}/edit`,
      data: record, // your data array of objects
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

  useEffect(async () => {
    setData(props.tableData);
    if (
      props.paginationData &&
      currentPageNumber > Math.ceil(props.paginationData.totalPages)
    ) {
      setcurrentPageNumber(1);
    }
  }, [
    props.tableData,
    props.tableDataLoading,
    props.paginationData,
  ]); /* imp passing props to re-render */

  const columns = [
    {
      title: "Name",
      dataIndex: "courier_name",
      width: "50%",
    },
    {
      title: "Code",
      dataIndex: "courier_code",
    },
    {
      title: "Operations",
      render: (_, record) => {
        return (
          <div className="action-btns">
            <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
            {data.length >= 1 ? (
              <Typography.Link onClick={() => handleDelete(record)}>
                Delete
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
        rowClassName="editable-row"
        className="table-frame"
        pagination={{
          total: props.paginationData && props.paginationData.totalElements,
          showTotal: (total, range) => showTotalItemsBar(total, range),
          defaultPageSize: 10,
          pageSize: parseInt(props.pageLimit),
          showSizeChanger: false,
          current: currentPageNumber,
          onChange: (page, pageSize) => handlePageChange(page, pageSize),
        }}
        loading={props.tableDataLoading}
        rowKey="courier_id"
      />
    </Form>
  );
};

export default CouriersTable;
