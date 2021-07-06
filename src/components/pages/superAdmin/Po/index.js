
import React, { useState, useEffect } from "react";
//import { message, Modal, Typography , Button, Col, Row } from "antd";
import SaViewtableStock from "../../../organism/table/superAdmin/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../utils/constants/constants';
//import moment from 'moment';



const SaPurchaseOrder = (props) => {
  const [paginationLimit,] = useState(10);
  const [, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [, setLocalStorageData] = useState("");

  

  let mounted = true;


  const fetchSaPurchaseOrdersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const purchaseOrdersViewResponse = await StockApiUtil.viewPurchaseOrders(pageLimit, pageNumber);
    console.log('poViewResponse:', purchaseOrdersViewResponse);

    if (purchaseOrdersViewResponse.hasError) {
      console.log('Cant fetch Purchase Ordrs Data -> ', purchaseOrdersViewResponse.errorMessage);
       /*------------------new verion---------------------*/
       setData([]);
       setPaginationData({});
       /*------------------new verion---------------------*/
      document.getElementById('app-loader-container').style.display = "none";
      //message.warning(purchaseOrdersViewResponse.errorMessage, 3);
    }
    else {
      console.log('res -> ', purchaseOrdersViewResponse);
      if (mounted) {     //imp if unmounted
        setData(purchaseOrdersViewResponse.purchase.data || purchaseOrdersViewResponse.purchase);
        setPaginationData(purchaseOrdersViewResponse.purchase.page || {});
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(purchaseOrdersViewResponse.message, 3);
      }
    }
  }


  useEffect(() => {

    fetchSaPurchaseOrdersData();
    let userData = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    userData = userData.data ? userData.data : null;

    if (userData) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        setLocalStorageData(userData);
        //getUserStoreData(userData.auth.current_store);  //imp to get user outlet data

      }
    }

    return () => {
      mounted = false;
    }

  }, []);


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    fetchSaPurchaseOrdersData(paginationLimit, currentPg);
  }






 
  return (
    <div className='stock-sa-po'>

      {/* Table */}
      <div className='table'>
        <SaViewtableStock pageLimit={paginationLimit}
          tableData={data}
          onClickPageChanger={handlePageChange}
          //onPoQuickViewSelection={handlePoQuickViewSelection}
          paginationData={paginationData}
          tableType="purchase_orders" />
      </div>

      {/* Table */}



    </div>
  );
};

export default SaPurchaseOrder;