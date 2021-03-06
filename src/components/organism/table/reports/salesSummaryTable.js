import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useHistory } from 'react-router-dom';
import moment from 'moment';


const SalesSummaryTable = (props) => {
  const [data, setData] = useState([]);



  const showTotalItemsBar = (total, range) => {
    console.log(range);
    return `${range[0]}-${range[1]} of ${total} items`
  };

  useEffect(() => {
    setData(props.tableData);

  }, [props.tableData, props.tableDataLoading]);  /* imp passing props to re-render */



  const columns = [
    {
      title: "Date",
      dataIndex: "Dispatch",
      width: "25%",
      render: (_, record) => {  
        return  moment(record.Dispatch).format("DD/MM/yyyy hh:mm A");
      },
    },
    {
      title: "Invoice No.",
      dataIndex: "invoice_no",
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
    },
    {
      title: "SkU",
      dataIndex: "sku",
    },
    {
      title: "Product Name",
      dataIndex: "name",
    },
    {
      title: "Variant 1",
      dataIndex: "product_variant1_value",
    },
    {
      title: "Variant 2",
      dataIndex: "product_variant1_value",
    },
    {
      title: "Retail Price",
      dataIndex: "retail_price",
      render: (_, record) => {
        return (
          <span> {parseInt(record.retail_price).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Sale Price",
      dataIndex: "sale_price",
      render: (_, record) => {
        return (
          <span> {parseInt(record.sale_price).toFixed(2)} </span>
        );
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => {
        return (
          <span> {parseInt(record.quantity).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Sales",
      dataIndex: "total_sale",
      render: (_, record) => {
        return (
          <span> {parseInt(record.total_sale).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Gross Sales",
      dataIndex: "gross_sale",
      render: (_, record) => {
        return (
          <span> {parseInt(record.gross_sale).toFixed(2)} </span>
        );
      },
    },
    ,
    {
      title: "Tax",
      dataIndex: "tax",
      render: (_, record) => {
        return (
          <span> {parseInt(record.tax).toFixed(2)} </span>
        );
      },
    },
    ,
    {
      title: "Net Sales",
      dataIndex: "net_sales",
      render: (_, record) => {
        return (
          <span> {parseInt(record.net_sales).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (_, record) => {
        return (
          <span> {parseInt(record.cost).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Margin",
      dataIndex: "margin",
      render: (_, record) => {
        return (
          <span> {parseInt(record.margin).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      render: (_, record) => {
        return (
          <span> {parseInt(record.Discount).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Mop",
      dataIndex: "MOP",
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

    <Table
      bordered
      dataSource={data}
      columns={mergedColumns}
      rowClassName='editable-row'
      className='table-frame'
      id={props.tableId} //imp to pass table id here
      pagination={{
        total: data && data.length,
        showTotal: (total, range) => showTotalItemsBar(total, range),
        defaultPageSize: 20,
        pageSize: parseInt(props.pageLimit),
        showSizeChanger: false,

      }}
      loading={props.tableDataLoading}
      
    />
  );
};

export default SalesSummaryTable;

