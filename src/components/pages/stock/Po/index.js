
import React, { useState, useEffect } from "react";
import { message, Modal, Typography , Button, Col, Row } from "antd";
import ViewtableStock from "../../../organism/table/stock/stockTable";
import StockReceiveProductsTable from "../../../organism/table/stock/stockReceiveTable";
import PrintPurchaseOrderTable from "./viewPo";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../utils/constants/constants';
import moment from 'moment';



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
  const [localStorageData, setLocalStorageData] = useState("");
  const [selectedPoRecordData, setSelectedPoRecordData] = useState("");
  const [selectedPoProductsData, setSelectedPoProductsData] = useState([]);
  const [selectedAllPoData, setSelectedAllPoData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [currentOutletData, setCurrentOutletData] = useState(null);
  const [productsTotalAmount, setProductsTotalAmount] = useState(0);
  


  let mounted = true;


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

    let userData = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    userData = userData.data ? userData.data : null;

    if (userData) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        setLocalStorageData(userData);
        getUserStoreData(userData.auth.current_store);  //imp to get user outlet data
      }
    }

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
      document.getElementById('app-loader-container').style.display = "none";
      message.warning(receivePurchaseOrdersResponse.errorMessage, 3);
    }
    else {
      console.log('res -> ', receivePurchaseOrdersResponse);
      if (mounted) {     //imp if unmounted
        //setPoData(receivePurchaseOrdersResponse.purchase_order_info);
        let receiveProducts = [...receivePurchaseOrdersResponse.products];
        setSelectedPoProductsData(receiveProducts);
        setSelectedAllPoData(receivePurchaseOrdersResponse);
        /*---getting total amount----------------*/
        let productsTotal = 0;
        receiveProducts.forEach(item => {
          productsTotal = productsTotal + (parseFloat(item.purchase_order_junction_quantity || 0) * parseFloat(item.purchase_order_junction_price));
        });
        setProductsTotalAmount(productsTotal);
        /*---getting total amount----------------*/
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(receivePurchaseOrdersResponse.message, 3);
        setIsQuickViewPoModalVisible(true);    //show modal for purchasce order view for now

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
      receivePurchaseOrders(tableRecord.purchase_order_id);    //imp

    }

  }


  const handleQuickPoCancelModal = () => {
    setIsQuickViewPoModalVisible(false);

  }


  const printPoOverview = () => {
    let previewPrintPoHtml = document.getElementById("printPoTable");
    if(!previewPrintPoHtml){return;}
    previewPrintPoHtml = document.getElementById("printPoTable").innerHTML;

    var doc =
      '<html><head><title></title><link rel="stylesheet" type="text/css" href="/printInvoice.scss" /></head><body onload="window.print(); window.close();">' +
      previewPrintPoHtml +
      "</body></html>";
    /* NEW TAB OPEN PRINT */
    var popupWin = window.open("", "_blank");
    popupWin.document.open();
    // window.print(); window.close(); 'width: 80%, height=80%'
    popupWin.document.write(doc);
    popupWin.document.close();  //vvimp for autoprint
  };


  const getUserStoreData = async (storeId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getOutletViewResponse = await SetupApiUtil.getOutlet(storeId);
    console.log('getOutletViewResponse:', getOutletViewResponse);

    if (getOutletViewResponse.hasError) {
      console.log('Cant fetch Store Data -> ', getOutletViewResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', getOutletViewResponse);
      let selectedStore = getOutletViewResponse.outlet;
      setCurrentOutletData(selectedStore);
      getTemplateData(selectedStore.template_id);   //imp to get template data

    }
  }



  const getTemplateData = async (templateId) => {
    
    const getTepmlateResponse = await SetupApiUtil.getTemplate(templateId);
    console.log('getTepmlateResponse:', getTepmlateResponse);

    if (getTepmlateResponse.hasError) {
      console.log('Cant get template Data -> ', getTepmlateResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', getTepmlateResponse);
      var receivedTemplateData = getTepmlateResponse.template;
      setTemplateData(receivedTemplateData);
      document.getElementById('app-loader-container').style.display = "none";

    }
  } 

  let PoInfo = selectedAllPoData && selectedAllPoData.purchase_order_info;







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
          <Button key="back" onClick={handleQuickPoCancelModal}
          >
            Cancel
            </Button>,
          <Button key="submit" type="primary" 
            className="custom-btn--primary" onClick={printPoOverview}
          >
            Print
            </Button>
        ]}

      >

        {PoInfo &&
          <Row gutter={16, 16} className="stock-receive-row-heading">
            <Col xs={24} sm={24} md={12} className="stock-item-content">
              <span> Name / reference: &nbsp; {PoInfo.purchase_order_name || ""} &nbsp; [Open] </span>
            </Col>
            <Col xs={24} sm={24} md={12} className="stock-item-content">
              <span> Order No:  &nbsp;{PoInfo.purchase_order_show_id || ""} </span>
            </Col>
            <Col xs={24} sm={24} md={12} className="stock-item-content">
              <span>  Ordered date: &nbsp;
                {moment(PoInfo.purchase_order_order_datetime).format("MM DD, yyyy")}
              </span>
            </Col>
            <Col xs={24} sm={24} md={12} className="stock-item-content">
              <span> Due date:  &nbsp;
                {moment(PoInfo.purchase_order_delivery_datetime).format("MM DD, yyyy")}
              </span>
            </Col>
            <Col xs={24} sm={24} md={12} className="stock-item-content">
              <span> Supplier:  &nbsp; {PoInfo.supplier_name || ""} </span>
            </Col>
          </Row>}



        {/* Table */}
        <div className='table'>
          <StockReceiveProductsTable pageLimit={paginationLimit}
            tableData={selectedPoProductsData}
            tableType="quick-view_purchase_orders"

          />
        </div>
        {/* Table */}

        <Row style={{ textAlign: "center", marginTop: "2rem" }}>
          {/*-------------------------------------------*/}
          <Col xs={24} sm={24} md={6} offset={12}>
            <span> Total: </span>
          </Col>
          <Col xs={24} sm={24} md={6} >
            <span> { parseFloat(productsTotalAmount).toFixed(2) } </span>
          </Col>

        </Row>


      </Modal>

        {/*--Modal for quick view functionality*/}

      {/* Table */}


       {/* print sales overview */}
       {(selectedAllPoData) && (
        <PrintPurchaseOrderTable
          user={localStorageData}
          selectedOutletTemplateData={templateData}
          poData={selectedAllPoData}
          totalQty={productsTotalAmount}
          currentOutlet={currentOutletData}
        />
      )}



    </div>
  );
};

export default PurchaseOrder;