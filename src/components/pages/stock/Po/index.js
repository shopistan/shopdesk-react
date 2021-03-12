import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import Constants from '../../../../utils/constants/constants';
import { 
    getDataFromLocalStorage,
  } from "../../../../utils/local-storage/local-store-utils";



const PurchaseOrder = (props) => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [activeStoreId, setActiveStoreId] = useState("");



  const fetchPurchaseOrdersData = async (pageLimit = 10, pageNumber = 1) => {
    const purchaseOrdersViewResponse = await StockApiUtil.viewPurchaseOrders(pageLimit, pageNumber);
    console.log('poViewResponse:', purchaseOrdersViewResponse);

    if (purchaseOrdersViewResponse.hasError) {
      console.log('Cant fetch Purchase Ordrs Data -> ', purchaseOrdersViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', purchaseOrdersViewResponse);
      message.success(purchaseOrdersViewResponse.message, 3);
      setData(purchaseOrdersViewResponse.purchase.data || purchaseOrdersViewResponse.purchase);
      setPaginationData(purchaseOrdersViewResponse.purchase.page || {});
      setLoading(false);
    }
  }


  useEffect( () => {
    fetchPurchaseOrdersData();

  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchPurchaseOrdersData(paginationLimit, currentPg);
  }


  return (
    <div className='stock-po'>

        {/* Table */}
        <div className='table'>
          <ViewtableStock  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} 
            tableType="purchase_orders" />
        </div>

        {/* Table */} 
    </div>
  );
};

export default PurchaseOrder;