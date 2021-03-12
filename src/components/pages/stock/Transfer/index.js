import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import Constants from '../../../../utils/constants/constants';
import { 
    getDataFromLocalStorage,
  } from "../../../../utils/local-storage/local-store-utils";



const TransferInventory = (props) => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [activeStoreId, setActiveStoreId] = useState("");



  const fetchInventoryTransfersData = async (pageLimit = 10, pageNumber = 1) => {
    const inventoryTransfersViewResponse = await StockApiUtil.viewInventoryTransfers(pageLimit, pageNumber);
    console.log('inventoryTransfersViewResponse:', inventoryTransfersViewResponse);

    if (inventoryTransfersViewResponse.hasError) {
      console.log('Cant fetch inventory Transfers Data -> ', inventoryTransfersViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', inventoryTransfersViewResponse);
      message.success(inventoryTransfersViewResponse.message, 3);
      setData(inventoryTransfersViewResponse.transfer.data || inventoryTransfersViewResponse.transfer);
      setPaginationData(inventoryTransfersViewResponse.transfer.page || {});
      setLoading(false);
    }
  }


  useEffect( () => {
    fetchInventoryTransfersData();
    var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    if (readFromLocalStorage) {
        setActiveStoreId(readFromLocalStorage.auth.current_store);  //string
    }

  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchInventoryTransfersData(paginationLimit, currentPg);
  }


  return (
    <div className='stock-po'>

        {/* Table */}
        <div className='table'>
          <ViewtableStock  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} 
            tableType="inventory_transfers" currentStoreId={activeStoreId} />
        </div>

        {/* Table */} 
    </div>
  );
};

export default TransferInventory;