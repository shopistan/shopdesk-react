import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as SalesApiUtil from '../../../../utils/api/sales-api-utils';
import moment from 'moment';

const dateFormat = "YYYY-MM-DD";


const  ReturnedStock = (props) => {
  const { selectedDates = "", exportTransferCheck = "" } = props;
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});


  let mounted = true;


  const fetchStockReturnedData = async (pageLimit = 10, pageNumber = 1) => {

    let startDate  =  selectedDates[0] ? selectedDates[0]  : moment(new Date()).format(dateFormat);
    let finishDate =  selectedDates[1] ? selectedDates[1]  : moment(new Date()).format(dateFormat);

    document.getElementById('app-loader-container').style.display = "block";
    const stockReturnedViewResponse = await StockApiUtil.viewStockReturned(
      pageLimit,
      pageNumber,
      startDate,
      finishDate,
    );
    console.log('stockReturnedViewResponse:', stockReturnedViewResponse);

    if (stockReturnedViewResponse.hasError) {
      console.log('Cant fetch stock returned Data -> ', stockReturnedViewResponse.errorMessage);
      setLoading(false);
      /*------------------new verion---------------------*/
      setData([]);
      setPaginationData({});
      /*------------------new verion---------------------*/
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', stockReturnedViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(stockAdjustmentsViewResponse.message, 3);
        setData(stockReturnedViewResponse.return.data || stockReturnedViewResponse.return);
        setPaginationData(stockReturnedViewResponse.return.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  useEffect( () => {
    if (exportTransferCheck === true) {
      ExportToCsv();
    }
    if (exportTransferCheck === false) {
      fetchStockReturnedData();
    }
    
    return () => {
      mounted = false;
    }
    
  }, [selectedDates, exportTransferCheck]);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchStockReturnedData(paginationLimit, currentPg);
  }


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
        downloadStockReturnedCSVData(getStoreResponse || null);
      }
    }
    else { message.warning("Purchase Orders Data Not Found", 3) } 

  }


  
  const downloadStockReturnedCSVData = async (fetchedStore) => {
    //console.log("fetchedStore", fetchedStore);
    let stockReturnedImportParams = {
      "store_id": fetchedStore.store_id,
      "startDate": selectedDates[0] || moment(new Date()).format("YYYY-MM-DD"),
      "finishDate": selectedDates[1] ||moment(new Date()).format("YYYY-MM-DD"),
    };

    const stockReturnedExportResponse = await StockApiUtil.exportReturnedStock(
      stockReturnedImportParams
    );
    
    console.log("Stock Returned Export response:", stockReturnedExportResponse);

    if (stockReturnedExportResponse.hasError) {
      console.log(
        "Cant Export Stock Returned Data-> ",
        stockReturnedExportResponse.errorMessage
      );
      
      document.getElementById('app-loader-container').style.display = "none";
      message.error(stockReturnedExportResponse.errorMessage, 3);

    } else {
      //console.log("res -> ", stockReturnedExportResponse.data);
      /*---------------csv download--------------------------------*/
      if (mounted) {     //imp if unmounted
        // CSV FILE
        let csvFile = new Blob([stockReturnedExportResponse.data], { type: "text/csv" });
        let url = window.URL.createObjectURL(csvFile);
        let a = document.createElement('a');
        a.href = url;
        a.download = "stock_returned_" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
        /*---------------csv download--------------------------------*/
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(stockReturnedExportResponse.message, 3);

      }

    }

  }
  


  return (
    <div className='stock-returned'>

        {/* Table */}
        <div className='table'>
          <ViewtableStock  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} 
            tableType="stock_returned"  />
        </div>

        {/* Table */} 
    </div>
  );
};

export default ReturnedStock;