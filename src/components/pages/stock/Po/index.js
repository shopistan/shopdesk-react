import React, { useState, useEffect } from "react";
import { message, Modal, Typography , Button, Col, Row } from "antd";
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
  const [isQuickViewPoModalVisible, setIsQuickViewPoModalVisible] = useState(false);
  const [, setCurrentViewedPoQuickViewId] = useState("");
  const [selectedPoRecordData, setSelectedPoRecordData] = useState("");
  const [selectedPoProductsData, setSelectedPoProductsData] = useState([]);
  




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



  const receivePurchaseOrders = async (purchaseOrderId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const receivePurchaseOrdersResponse = await StockApiUtil.receivePurchaseOrder(purchaseOrderId);
    console.log('receivePurchaseOrdersResponse:', receivePurchaseOrdersResponse);

    if (receivePurchaseOrdersResponse.hasError) {
      console.log('Cant fetch Purchase Order Data -> ', receivePurchaseOrdersResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', receivePurchaseOrdersResponse);
      if (mounted) {     //imp if unmounted
        //setPoData(receivePurchaseOrdersResponse.purchase_order_info);
        let receiveProducts = [...receivePurchaseOrdersResponse.products];
        setSelectedPoProductsData(receiveProducts);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(receivePurchaseOrdersResponse.message, 3);
        //setIsQuickViewPoModalVisible(true);    //hide for now
      }

    }
  }


  const handleCancelForceCloseModal = () => {
    setIsForceCloseModalVisible(false);
  };


  function handlePoQuickViewSelection(tableRecord) {
    if (tableRecord) {
      console.log("table-record");
      setCurrentViewedPoQuickViewId(tableRecord.purchase_order_id);
      setSelectedPoRecordData(tableRecord);  //imp for quick view stats
      //receivePurchaseOrders(tableRecord.purchase_order_id);    //imp

    }

  }


  const handleQuickPoCancelModal = () => {
    setIsQuickViewPoModalVisible(false);

  }





  return (
    <div className='stock-po'>

      {/* Table */}
      <div className='table'>
        <ViewtableStock pageLimit={paginationLimit}
          tableData={data}
          tableDataLoading={loading}
          onClickPageChanger={handlePageChange}
          onForceCloseOrderHandler={handleForceCloseOrderEvent}
          onPoQuickViewSelection={handlePoQuickViewSelection}
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



       {/*--Modal for quick view functionality*/}
       <Modal title='Purchase Order View'
          wrapClassName='quick-view-modal-dailog'
          visible={isQuickViewPoModalVisible}
          onCancel={handleQuickPoCancelModal}
          onOk={handleQuickPoCancelModal}
          width={700}
          footer={[
            <Button key="back" //onClick={handleQuickViewCancelModal}
            >
              Cancel
            </Button>,
            <Button key="submit" type="primary" //loading={loading} 
              className="custom-btn--primary" //onClick={handlePrintQuickSaleInvoice}
            >
              Print
            </Button>
          ]}

        >



          <Row style={{ textAlign: "center", marginTop: "2rem" }}>
            {/*-------------------------------------------*/}
            <Col xs={24} sm={24} md={6} offset={12}>
              <span> Total: </span>
            </Col>
            <Col xs={24} sm={24} md={6} >
              <span> {} </span>
            </Col>

          </Row>


        </Modal>

        {/*--Modal for quick view functionality*/}


      {/* Table */}
    </div>
  );
};

export default PurchaseOrder;