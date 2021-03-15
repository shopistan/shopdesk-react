import React, { useState, useEffect } from "react";
import { message, Modal, Typography } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import Constants from '../../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";

const { Text } = Typography;


const TransferInventory = (props) => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isForceCloseModalVisible, setIsForceCloseModalVisible] = useState(false);
  const [forceCloseOrderData, setForceCloseOrderData] = useState({});
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


  useEffect(() => {
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


  const confirmForceClose = async () => {

    var transferId = forceCloseOrderData.transfer_id;
    const closeTransferResponse = await StockApiUtil.closeTransferInventoryOrder(
      transferId
    );
    console.log('closeTransferResponse:',  closeTransferResponse);

    if ( closeTransferResponse.hasError) {
      console.log('Cant close Purchase Order -> ',  closeTransferResponse.errorMessage);
    }
    else {
      console.log('res -> ',  closeTransferResponse);
      message.success( closeTransferResponse.message, 3);
      setIsForceCloseModalVisible(false);
      fetchInventoryTransfersData();
    }

  };


  function handleForceCloseOrderEvent(tableRecord) {
    console.log("imp", tableRecord);
    setIsForceCloseModalVisible(true);
    setForceCloseOrderData(tableRecord)
  }


  const handleCancelForceCloseModal = () => {
    setIsForceCloseModalVisible(false);
  };



  return (
    <div className='stock-transfers'>

      {/* Table */}
      <div className='table'>
        <ViewtableStock pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
          onClickPageChanger={handlePageChange} paginationData={paginationData}
          tableType="inventory_transfers" currentStoreId={activeStoreId}
          onForceCloseOrderHandler={handleForceCloseOrderEvent} />

      </div>

      {/* Table */}

      <Modal title="Please Confirm" visible={isForceCloseModalVisible}
        onOk={confirmForceClose}
        onCancel={handleCancelForceCloseModal}>

        <div className='form__row'>
          <div className='form__col'>
            <Text>Do you really want to Force Close '
              {forceCloseOrderData.transfer_name}'?</Text>
          </div>
        </div>

      </Modal>



    </div>
  );
};

export default TransferInventory;