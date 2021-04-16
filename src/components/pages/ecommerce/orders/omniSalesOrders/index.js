import React, { useState, useEffect } from "react";

import { Input, Button } from "antd";
import OmniSalesOrdersTable from "../../../../organism/table/ecommerce/omniSalesOrdersTable";
import "../../style.scss";

const { Search } = Input;

function OmniSalesOrders(props) {
  const { data = {},
    paginationLimit,
    paginationDataObj,
    tableLoading,
    tableDataType,
    currencySymbol,
  } = props;


  const [tabData, setTabData] = useState(data);


  useEffect(() => {
    setTabData(data);

  }, [data, paginationLimit, paginationDataObj]);  //imp to render when history prop changes




  const handleSaleOrdersTableRowsSelection = (selectedRowKeys, selectedRows) => {
    //console.log(selectedRows);
    //console.log(selectedRowKeys);
    props.onSaleOrderSelection(selectedRowKeys, selectedRows);
  }



  return (
    <div className="allOrders">
      {/*<div className="search">
        <Button type="primary">Make Invoice</Button>
        <Search
          allowClear
          size="middle"
          onChange={onSearch}
          style={{ width: 300 }}
        />
      </div>  *}

       {/* Table */}
      <div className='table omni-sales-table'>
        <OmniSalesOrdersTable
          tableData={tabData}
          pageLimit={paginationLimit}
          paginationData={paginationDataObj}
          tableDataLoading={tableLoading}
          onSaleOrdersSelectedTableRows={handleSaleOrdersTableRowsSelection}
          tableType={tableDataType}
          currency={currencySymbol}
        />

      </div>
      {/* Table */}

    </div>

  );
}

export default OmniSalesOrders;
