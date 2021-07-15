import React, { useState, useEffect } from "react";
import { message, Modal, Typography } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as SalesApiUtil from '../../../../utils/api/sales-api-utils';
import Constants from '../../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import moment from 'moment';

const dateFormat = "YYYY-MM-DD";



const { Text } = Typography;


const TransferInventory = (props) => {
  let { selectedDates = "", exportTransferCheck = "" } = props;
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isForceCloseModalVisible, setIsForceCloseModalVisible] = useState(false);
  const [forceCloseOrderData, setForceCloseOrderData] = useState({});
  const [paginationData, setPaginationData] = useState({});
  const [activeStoreId, setActiveStoreId] = useState("");

  var mounted = true;


  const fetchInventoryTransfersData = async (pageLimit = 10, pageNumber = 1) => {

    let startDate  =  selectedDates[0] ? selectedDates[0]  : moment(new Date()).format(dateFormat);
    let finishDate =  selectedDates[1] ? selectedDates[1]  : moment(new Date()).format(dateFormat);

    document.getElementById('app-loader-container').style.display = "block";
    const inventoryTransfersViewResponse = await StockApiUtil.viewInventoryTransfers(
      pageLimit,
      pageNumber,
      startDate,
      finishDate,
    );
    console.log('inventoryTransfersViewResponse:', inventoryTransfersViewResponse);

    if (inventoryTransfersViewResponse.hasError) {
      console.log('Cant fetch inventory Transfers Data -> ', inventoryTransfersViewResponse.errorMessage);
      setLoading(false);
      /*------------------new verion---------------------*/
      setData([]);
      setPaginationData({});
      /*------------------new verion---------------------*/
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', inventoryTransfersViewResponse);
      let inventoryTransfersData =  inventoryTransfersViewResponse.transfer.data || inventoryTransfersViewResponse.transfer;
      if (mounted) {     //imp if unmounted
        //message.success(inventoryTransfersViewResponse.message, 3);
        setData(inventoryTransfersData);
        setPaginationData(inventoryTransfersViewResponse.transfer.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        
        for (let i in inventoryTransfersData) {
          if (
            inventoryTransfersData[i].transfer_status === "1"
          ) {
            message.success("Some Of The Inventory Transfers Are pending", 3);
            break;
          }
        }

      }
    }
  }


  useEffect(() => {
    if (exportTransferCheck === true) {
      ExportToCsv();
    }
    if (exportTransferCheck === false) {
      fetchInventoryTransfersData();
    }

    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    if (readFromLocalStorage) {
      setActiveStoreId(readFromLocalStorage.auth.current_store);  //string
    }

    return () => {
      mounted = false;
    }

  }, [selectedDates, exportTransferCheck]);       //imp to rerender



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
      message.error(closeTransferResponse.errorMessage, 3);
      setIsForceCloseModalVisible(false);
    }
    else {
      console.log('res -> ',  closeTransferResponse);
      //message.success( closeTransferResponse.message, 3);
      setIsForceCloseModalVisible(false);
      fetchInventoryTransfersData();
    }

  };


  function handleForceCloseOrderEvent(tableRecord) {
    setIsForceCloseModalVisible(true);
    setForceCloseOrderData(tableRecord)
  }


  const handleCancelForceCloseModal = () => {
    setIsForceCloseModalVisible(false);
  };



  const ExportToCsv = async (e) => {

    if (data.length > 0) {
      document.getElementById('app-loader-container').style.display = "block";
      const getStoreResponse = await SalesApiUtil.getStoreId();
      if (getStoreResponse.hasError) {
        const errorMessage = getStoreResponse.errorMessage;
        console.log('Cant get Store Id -> ', errorMessage);
        document.getElementById('app-loader-container').style.display = "none";
        message.error(errorMessage, 3);
      } else {
        console.log("Success:", getStoreResponse.message);
        downloadInventoryTransfersData(getStoreResponse || null);
      }
    }
    else { message.warning("Inventory Transfers Data Not Found", 3) } 

  }


  
  const downloadInventoryTransfersData = async (fetchedStore) => {
    //console.log("fetchedStore", fetchedStore);
    let inventoryTransfersImportParams = {
      "store_id": fetchedStore.store_id,
      "startDate": selectedDates[0] || moment(new Date()).format("YYYY-MM-DD"),
      "finishDate": selectedDates[1] ||moment(new Date()).format("YYYY-MM-DD"),
    };


    const inventoryTransfersExportResponse = await StockApiUtil.exportInventoryTransfers(
      inventoryTransfersImportParams
    );
    
    console.log("Inventory Transfers Export response:", inventoryTransfersExportResponse);

    if (inventoryTransfersExportResponse.hasError) {
      console.log(
        "Cant Export Inventory Transfers-> ",
        inventoryTransfersExportResponse.errorMessage
      );
      
      document.getElementById('app-loader-container').style.display = "none";
      message.error(inventoryTransfersExportResponse.errorMessage, 3);

    } else {
      //console.log("res -> ", inventoryTransfersExportResponse.data);
      /*---------------csv download--------------------------------*/
      if (mounted) {     //imp if unmounted
        // CSV FILE
        let csvFile = new Blob([inventoryTransfersExportResponse.data], { type: "text/csv" });
        let url = window.URL.createObjectURL(csvFile);
        let a = document.createElement('a');
        a.href = url;
        a.download = "inventory_transfers_" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
        /*---------------csv download--------------------------------*/
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(inventoryTransfersExportResponse.message, 3);

      }

    }

  }



 



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