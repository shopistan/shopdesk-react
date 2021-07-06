import React, { useState, useEffect } from "react";
import SaViewtableStock from "../../../organism/table/superAdmin/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import Constants from '../../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import moment from 'moment';


const dateFormat = "YYYY-MM-DD";


const SaTransferInventory = (props) => {
  const { selectedDates = "" } = props;
  const [paginationLimit,] = useState(10);
  const [, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [activeStoreId, setActiveStoreId] = useState("");


  let mounted = true;


  const fetchSaInventoryTransfersData = async (pageLimit = 10, pageNumber = 1) => {

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
        setData(inventoryTransfersData);
        setPaginationData(inventoryTransfersViewResponse.transfer.page || {});
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(inventoryTransfersViewResponse.message, 3);
        
        for (let i in inventoryTransfersData) {
          if (
            inventoryTransfersData[i].transfer_status === "1"
          ) {
            //message.success("Some Of The Inventory Transfers Are pending", 3);
            break;
          }
        }
        

      }
    }
  }


  useEffect(() => {
    
    if(selectedDates !== null){
    fetchSaInventoryTransfersData();}
    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    if (readFromLocalStorage) {
      setActiveStoreId(readFromLocalStorage.auth.current_store);  //string
    }

    return () => {
      mounted = false;
    }

  }, [selectedDates]);       //imp to rerender



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    fetchSaInventoryTransfersData(paginationLimit, currentPg);
  }






  return (
    <div className='sa-stock-transfers'>

      {/* Table */}
      <div className='table'>
        <SaViewtableStock pageLimit={paginationLimit} tableData={data}
          onClickPageChanger={handlePageChange} paginationData={paginationData}
          tableType="inventory_transfers" currentStoreId={activeStoreId}
        />

      </div>

      {/* Table */}


    </div>
  );
};

export default SaTransferInventory;