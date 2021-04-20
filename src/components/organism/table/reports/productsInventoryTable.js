import React, { useState, useEffect } from "react";
import { Table } from "antd";


const ProductsInventoryTable = (props) => {
  const [data, setData] = useState([]);


  const showTotalItemsBar = (total, range) => {
    console.log(range);
    return `${range[0]}-${range[1]} of ${total} items`
  };


  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  useEffect(() => {
    setData(props.tableData);

  }, [props.tableData, props.tableDataLoading]);  /* imp passing props to re-render */


  var columns;



  columns = [
    {
      title: "SKU",
      dataIndex: "sku",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Variant 1",
      dataIndex: "variant1",
    },
    {
      title: "Variant 2",
      dataIndex: "variant2",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Stock Value",
      dataIndex: "stock_value",
      render: (_, record) => {
        let stockValue = parseFloat(record.stock_value).toFixed(2);
        return (
          <span> {numberWithCommas(stockValue)} </span>
        );
      },
    },
    {
      title: "Item Value",
      dataIndex: "item_value",
      render: (_, record) => {
        let itemValue = parseFloat(record.item_value).toFixed(2);
        return (
          <span> {numberWithCommas(itemValue)} </span>
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

export default ProductsInventoryTable;

