import React, { useState, useEffect } from "react";
//import { message } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import moment from 'moment';

const dateFormat = "YYYY-MM-DD";


const  ReturnedStock = (props) => {
  const { selectedDates = "", exportTransferCheck } = props;
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
      //ExportToCsv();
    }
    if (exportTransferCheck === false) {
      fetchStockReturnedData();
    }
    
    return () => {
      mounted = false;
    }
    
  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchStockReturnedData(paginationLimit, currentPg);
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