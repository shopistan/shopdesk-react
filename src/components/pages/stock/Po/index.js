import React, { useState, useEffect } from "react";
import { message, Modal, Typography } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';

const { Text } = Typography;


const PurchaseOrder = (props) => {
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isForceCloseModalVisible, setIsForceCloseModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [forceCloseOrderData, setForceCloseOrderData] = useState({});
  const [paginationData, setPaginationData] = useState({});


  var mounted = true;


  const fetchPurchaseOrdersData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const purchaseOrdersViewResponse = await StockApiUtil.viewPurchaseOrders(pageLimit, pageNumber);
    console.log('poViewResponse:', purchaseOrdersViewResponse);

    if (purchaseOrdersViewResponse.hasError) {
      console.log('Cant fetch Purchase Ordrs Data -> ', purchaseOrdersViewResponse.errorMessage);
      setLoading(false);
      //message.warning(purchaseOrdersViewResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', purchaseOrdersViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(purchaseOrdersViewResponse.message, 3);
        setData(purchaseOrdersViewResponse.purchase.data || purchaseOrdersViewResponse.purchase);
        setPaginationData(purchaseOrdersViewResponse.purchase.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  useEffect(() => {
    fetchPurchaseOrdersData();

    return () => {
      mounted = false;
    }

  }, []);


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchPurchaseOrdersData(paginationLimit, currentPg);
  }



  const confirmForceClose =  async () => {

    var purchaseOrderId =  forceCloseOrderData.purchase_order_id;

    const closePurchaseOrderResponse = await StockApiUtil.closePurchaseOrder(
      purchaseOrderId
    );
    console.log('ClosePurchaseOrderResponse:', closePurchaseOrderResponse);

    if (closePurchaseOrderResponse.hasError) {
      console.log('Cant close Purchase Order -> ', closePurchaseOrderResponse.errorMessage);
      message.error(closePurchaseOrderResponse.errorMessage, 3);
      setIsForceCloseModalVisible(false);
    }
    else {
      console.log('res -> ', closePurchaseOrderResponse);
      message.success(closePurchaseOrderResponse.message, 3);
      setIsForceCloseModalVisible(false);
      fetchPurchaseOrdersData();
    }

  };


  function handleForceCloseOrderEvent(tableRecord) {
    setIsForceCloseModalVisible(true);
    setForceCloseOrderData(tableRecord)
  }


  const handleCancelForceCloseModal = () => {
    setIsForceCloseModalVisible(false);
  };





  return (
    <div className='stock-po'>

      {/* Table */}
      <div className='table'>
        <ViewtableStock pageLimit={paginationLimit}
          tableData={data}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          onForceCloseOrderHandler={handleForceCloseOrderEvent}
          paginationData={paginationData}
          tableType="purchase_orders" />
      </div>


      <Modal title="Please Confirm" visible={isForceCloseModalVisible}
        onOk={confirmForceClose}
        onCancel={handleCancelForceCloseModal}>
      
        <div className='form__row'>
          <div className='form__col'>
            <Text>Do you really want to Force Close '
              {forceCloseOrderData.purchase_order_name}'?</Text>
          </div>
        </div>

      </Modal>

      {/* Table */}
    </div>
  );
};

export default PurchaseOrder;