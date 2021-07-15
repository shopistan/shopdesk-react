import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as SalesApiUtil from '../../../../utils/api/sales-api-utils';
import moment from 'moment';

const dateFormat = "YYYY-MM-DD";


const  StockAdjustment = (props) => {
  const { selectedDates = "", exportTransferCheck = "" } = props;
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  //const [activeStoreId, setActiveStoreId] = useState("");

  var mounted = true;


  const fetchStockAdjustmentsData = async (pageLimit = 10, pageNumber = 1) => {

    let startDate  =  selectedDates[0] ? selectedDates[0]  : moment(new Date()).format(dateFormat);
    let finishDate =  selectedDates[1] ? selectedDates[1]  : moment(new Date()).format(dateFormat);

    document.getElementById('app-loader-container').style.display = "block";
    const stockAdjustmentsViewResponse = await StockApiUtil.viewStockAdjustments(
      pageLimit,
      pageNumber,
      startDate,
      finishDate,
    );
    console.log('stockAdjustmentsViewResponse:', stockAdjustmentsViewResponse);

    if (stockAdjustmentsViewResponse.hasError) {
      console.log('Cant fetch stock adjustments Data -> ', stockAdjustmentsViewResponse.errorMessage);
      setLoading(false);
      /*------------------new verion---------------------*/
      setData([]);
      setPaginationData({});
      /*------------------new verion---------------------*/
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', stockAdjustmentsViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(stockAdjustmentsViewResponse.message, 3);
        setData(stockAdjustmentsViewResponse.adjustment.data || stockAdjustmentsViewResponse.adjustment);
        setPaginationData(stockAdjustmentsViewResponse.adjustment.page || {});
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
      fetchStockAdjustmentsData();
    }
    
    return () => {
      mounted = false;
    }
    
  }, [selectedDates, exportTransferCheck]);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchStockAdjustmentsData(paginationLimit, currentPg);
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
        downloadStockAdjustmentsCSVData(getStoreResponse || null);
      }
    }
    else { message.warning("Stock Adjustments Data Not Found", 3) } 

  }


  
  const downloadStockAdjustmentsCSVData = async (fetchedStore) => {
    //console.log("fetchedStore", fetchedStore);
    let stockAdjustmentsImportParams = {
      "store_id": fetchedStore.store_id,
      "startDate": selectedDates[0] || moment(new Date()).format("YYYY-MM-DD"),
      "finishDate": selectedDates[1] ||moment(new Date()).format("YYYY-MM-DD"),
    };

    const stockAdjustmentsExportResponse = await StockApiUtil.exportStockAdjustments(
      stockAdjustmentsImportParams
    );
    
    console.log("Stock Adjustments Export response:", stockAdjustmentsExportResponse);

    if (stockAdjustmentsExportResponse.hasError) {
      console.log(
        "Cant Export Stock Adjustments Data-> ",
        stockAdjustmentsExportResponse.errorMessage
      );
      
      document.getElementById('app-loader-container').style.display = "none";
      message.error(stockAdjustmentsExportResponse.errorMessage, 3);

    } else {
      //console.log("res -> ", stockAdjustmentsExportResponse.data);
      /*---------------csv download--------------------------------*/
      if (mounted) {     //imp if unmounted
        // CSV FILE
        let csvFile = new Blob([stockAdjustmentsExportResponse.data], { type: "text/csv" });
        let url = window.URL.createObjectURL(csvFile);
        let a = document.createElement('a');
        a.href = url;
        a.download = "stock_adjustments_" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
        /*---------------csv download--------------------------------*/
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(stockAdjustmentsExportResponse.message, 3);

      }

    }

  }



  return (
    <div className='stock-po'>

        {/* Table */}
        <div className='table'>
          <ViewtableStock  pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            onClickPageChanger={handlePageChange} paginationData={paginationData} 
            tableType="stock_adjustments"  />
        </div>

        {/* Table */} 
    </div>
  );
};

export default StockAdjustment;