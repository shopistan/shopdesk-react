import React, { useState, useEffect } from "react";
import { Table } from "antd";
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


  var columns;

 
  if(props.summaryTableType === 'simple_sales'){

    columns = [
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
        title: "Invoice Note",
        dataIndex: "invoice_note",
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
        title: "Retail Price",
        dataIndex: "retail_price",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.retail_price).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Sale Price",
        dataIndex: "sale_price",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.sale_price).toFixed(2)} </span>
          );
        },
      },
  
      {
        title: "Quantity",
        dataIndex: "quantity",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.quantity).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Sales",
        dataIndex: "total_sale",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.total_sale).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Gross Sales",
        dataIndex: "gross_sale",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.gross_sale).toFixed(2)} </span>
          );
        },
      },
      ,
      {
        title: "Tax",
        dataIndex: "tax",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.tax).toFixed(2)} </span>
          );
        },
      },
      ,
      {
        title: "Net Sales",
        dataIndex: "net_sales",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.net_sales).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Cost",
        dataIndex: "cost",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.cost).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Margin",
        dataIndex: "margin",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.margin).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Discount",
        dataIndex: "Discount",
        render: (_, record) => {
          return (
            <span> {parseFloat(record.Discount).toFixed(2)} </span>
          );
        },
      },
      {
        title: "Mop",
        dataIndex: "MOP",
      },

  
    ];
  }

  /*--omni-sales---*/

  if(props.summaryTableType==='omni'){

  columns = [
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
      title: "Oder No.",
      dataIndex: "order_no",
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
    },
    {
      title: "SKU",
      dataIndex: "product_sku",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
    },
    {
      title: "Color",
      dataIndex: "color",
    },
    {
      title: "Size",
      dataIndex: "size",
    },
    {
      title: "Retail Price",
      dataIndex: "retail_price",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.retail_price).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Sale Price",
      dataIndex: "sale_price",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.sale_price).toFixed(2)} </span>
        );
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.quantity).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Sales",
      dataIndex: "total_sale",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.total_sale).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Sale Price (Original)",
      dataIndex: "gross_sale",
      render: (_, record) => {
        return (
          <span> { record.currency+' '+parseFloat(record.total_sale).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Gross Sales",
      dataIndex: "gross_sale",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.gross_sale).toFixed(2)} </span>
        );
      },
    },
    ,
    {
      title: "Tax",
      dataIndex: "tax",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.tax).toFixed(2)} </span>
        );
      },
    },
    ,
    {
      title: "Net Sales",
      dataIndex: "net_sales",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.net_sales).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.cost).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Margin",
      dataIndex: "margin",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.margin).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.Discount).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Mop",
      dataIndex: "MOP",
    },
    {
      title: "Shipping Cost",
      dataIndex: "shipping_cost",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.shipping_cost).toFixed(2)} </span>
        );
      },
    },
    {
      title: "Premium",
      dataIndex: "premium",
      render: (_, record) => {
        return (
          <span> {parseFloat(record.premium).toFixed(2)} </span>
        );
      },
    },

  ];

}



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
      //loading={props.tableDataLoading}
      rowKey="invoice_no"
      
    />
  );
};

export default SalesSummaryTable;

