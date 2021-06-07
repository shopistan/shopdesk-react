import React, { useState, useEffect } from "react";
import { message } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';


const  StockAdjustment = (props) => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  //const [activeStoreId, setActiveStoreId] = useState("");

  var mounted = true;


  const fetchStockAdjustmentsData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const stockAdjustmentsViewResponse = await StockApiUtil.viewStockAdjustments(pageLimit, pageNumber);
    console.log('stockAdjustmentsViewResponse:', stockAdjustmentsViewResponse);

    if (stockAdjustmentsViewResponse.hasError) {
      console.log('Cant fetch stock adjustments Data -> ', stockAdjustmentsViewResponse.errorMessage);
      setLoading(false);
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
    fetchStockAdjustmentsData();
    
    return () => {
      mounted = false;
    }
    
  }, []);



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchStockAdjustmentsData(paginationLimit, currentPg);
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