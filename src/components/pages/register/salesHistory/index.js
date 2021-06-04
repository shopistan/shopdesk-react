import React, { useState, useEffect } from "react";
// import "../style.scss";

import {
  Tabs,
  Button,
  Dropdown,
  Menu,
  message,
  Select,
  Input,
  Divider,
  Modal,
  Pagination,
  Row,
  Col,
}
  from "antd";
import { ProfileOutlined, DownOutlined, DownloadOutlined } from "@ant-design/icons";
import * as SalesApiUtil from '../../../../utils/api/sales-api-utils';
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import { useHistory } from "react-router-dom";
import * as Helpers from "../../../../utils/helpers/scripts";
import SellHistoryNestedProductsTable from "../../../organism/table/sell/sellHistoryProductsTable";
import SellNestedQuickViewProductsTable from "../../../organism/table/sell/sellNestedQuickViewProductsTable";

import {
  getSellInvoiceDataFromLocalStorage,
  saveDataIntoLocalStorage,
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../utils/constants/constants';
import PrintSalesInvoiceTable from "../sell/sellInvoice";
import moment from 'moment';




const { TabPane } = Tabs;

const SalesHistory = () => {
  const { Search } = Input;
  const { Option } = Select;
  const history = useHistory();
  const [paginationLimit, setPaginationLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("continue-sales");
  const [salesHistoryData, setSalesHistoryData] = useState([]);
  const [selectedTabData, setSelectedTabData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [salesListLimitCheck, setSalesListLimitCheck] = useState(true);
  const [currentViewedInvoiceId, setCurrentViewedInvoiceId] = useState("");
  const [currentViewedInvoiceQuickViewId, setCurrentViewedInvoiceQuickViewId] = useState("");
  const [selectedInvoiceData, setSelectedInvoiceData] = useState("");
  const [selectedHistoryRecordData, setSelectedHistoryRecordData] = useState("");
  const [selectedQuickViewInvoiceData, setSelectedQuickViewInvoiceData] = useState("");
  const [quickViewInvoicePrintData, setQuickViewInvoicePrintData] = useState(null);
  const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] = useState(false);
  const [localStorageData, setLocalStorageData] = useState("");
  const [isQuickViewInvoiceModalVisible, setIsQuickViewInvoiceModalVisible] = useState(false);
  const [localCurrentInvoice, setLocalCurrentInvoice] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataSearched, setDataSearched] = useState([]);
  const [dataSearchedAccumulate, setDataSearchedAccumulate] = useState([]);
  const [templateData, setTemplateData] = useState(null);


  var mounted = true;


  const salesTypeEnum = { PARKED: "1", COMPLETED: "0" }
  const salesHistoryEnum = { CONTINUE: "continue-sales", PROCESS: "process-returns", ALL: "all-sales" }


  useEffect(() => {

    fetchSalesHistoryData();

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

  }, []);  //imp to render when history prop changes



  const onSearch = (e) => {
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();

    if (currValue === "") {
      setLoading(true);

      fetchSalesHistoryData(paginationLimit, currentPage);
    } else {
      const filteredData = dataSearchedAccumulate.filter((entry) => {
        var invoiceDate = entry.invoice_datetime;
        invoiceDate = invoiceDate.toLowerCase();
        var invoiceShowId = entry.invoice_show_id;
        invoiceShowId = invoiceShowId.toLowerCase();
        var invoiceUserName = entry.user_name;
        invoiceUserName = invoiceUserName.toLowerCase();
        var invoiceMethod = entry.invoice_method;
        invoiceMethod = invoiceMethod.toLowerCase();

        return invoiceDate.includes(currValue) || invoiceShowId.includes(currValue) || invoiceUserName.includes(currValue) || invoiceMethod.includes(currValue);

      });

      setSelectedTabData(filteredData);

    }
  };




  const fetchSalesHistoryData = async (pageLimit = 20, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const salesHistoryViewResponse = await SalesApiUtil.getSalesHistory(
      pageLimit,
      pageNumber,
      salesListLimitCheck
    );
    console.log('salesHistoryViewResponse:', salesHistoryViewResponse);

    if (salesHistoryViewResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', salesHistoryViewResponse.errorMessage);
      message.warning(salesHistoryViewResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', salesHistoryViewResponse);
      if (mounted) {     //imp if unmounted
        var salesData = salesHistoryViewResponse.invoices.data || salesHistoryViewResponse.invoices;
        //message.success(salesHistoryViewResponse.message, 3);
        setSalesHistoryData(salesData);
        setPaginationData(salesHistoryViewResponse.invoices.page || {});
        /*-------setting sales data selection---------*/
        handletabChangeData(salesData); //imp
        /*-------setting continue sales data---------*/
         /*----------handle data serching response------------*/
         handledSearchedDataResponse(salesData);
         /*-----------handle data serching response-----------*/
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }



  function handledSearchedDataResponse(dataResponse) {
    var newData = [...dataSearched];
    dataResponse.forEach(item => {
      var foundObj = newData.find(obj => {
        return obj.invoice_id === item.invoice_id;
      });

      if (!foundObj) {
        newData.push(item);
      }
    });
    
    setDataSearched(newData);
    handleAccumulateSearchedData(currentTab, newData); //imp
  }



  const handleAccumulateSearchedData = (currentTabKey, searchedDataRecordsAccumulate) => {
    let filteredData;
    if (currentTabKey === salesHistoryEnum.CONTINUE) {
      filteredData = searchedDataRecordsAccumulate.filter((sale) => {
        return sale.invoice_status === salesTypeEnum.PARKED;
      });
      setDataSearchedAccumulate(filteredData);
    }

    if (currentTabKey === salesHistoryEnum.PROCESS) {
      filteredData = searchedDataRecordsAccumulate.filter((sale) => {
        return sale.invoice_status === salesTypeEnum.COMPLETED;
      });
      setDataSearchedAccumulate(filteredData);
    }

    if (currentTabKey === salesHistoryEnum.ALL) {
      setDataSearchedAccumulate(searchedDataRecordsAccumulate);
    }

  };



  const handletabChangeData = (salesHistoryDataRecords) => {
    var filteredData;
    if (currentTab === salesHistoryEnum.CONTINUE) {
      filteredData = salesHistoryDataRecords.filter((sale) => {
        return sale.invoice_status === salesTypeEnum.PARKED;
      });
      setSelectedTabData(filteredData);
    }

    if (currentTab === salesHistoryEnum.PROCESS) {
      filteredData = salesHistoryDataRecords.filter((sale) => {
        return sale.invoice_status === salesTypeEnum.COMPLETED;
      });
      setSelectedTabData(filteredData);
    }

    if (currentTab === salesHistoryEnum.ALL) {
      setSelectedTabData(salesHistoryDataRecords);
    }

  };




  const handletabChange = (key) => {
    var filteredData;
    if (key === salesHistoryEnum.CONTINUE) {
      filteredData = salesHistoryData.filter((sale) => {
        return sale.invoice_status === salesTypeEnum.PARKED;
      });
      setSelectedTabData(filteredData);
    }

    if (key === salesHistoryEnum.PROCESS) {
      filteredData = salesHistoryData.filter((sale) => {
        return sale.invoice_status === salesTypeEnum.COMPLETED;
      });
      setSelectedTabData(filteredData);
    }

    if (key === salesHistoryEnum.ALL) {
      setSelectedTabData(salesHistoryData);
    }

    setCurrentTab(key);
    handleAccumulateSearchedData(key, dataSearched);  //imp

  };


  function handleInvoiceSelection(tableRecord) {
    setCurrentViewedInvoiceId(tableRecord.invoice_id);
    /*-----------set user current invoice store-------------*/
    var localStorageCurrentInvoice = getSellInvoiceDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    localStorageCurrentInvoice = localStorageCurrentInvoice.data
      ? localStorageCurrentInvoice.data
      : null;

    setLocalCurrentInvoice(localStorageCurrentInvoice);
    /*-----------set user current invoice store-------------*/

    if (localStorageCurrentInvoice) { setIsViewInvoiceModalVisible(true); }  //cache invoice exists
    else { getSelectedInvoiceHistory(tableRecord.invoice_id); }

  }

  

  function handleInvoiceQuickViewSelection(tableRecord) {
    if (tableRecord) {
      setCurrentViewedInvoiceQuickViewId(tableRecord.invoice_id);
      setSelectedHistoryRecordData(tableRecord);  //imp for quick view stats
      getSelectedQuickViewInvoiceHistory(tableRecord.invoice_id, tableRecord);    //imp

    }

  }



  const returnToSaleInProgress = () => {
    history.push({
      pathname: "/register/sell",
    });

  }


  const saveAndContinue = () => {
    var localInvoiceQueue = getSellInvoiceDataFromLocalStorage(Constants.SELL_INVOICE_QUEUE_KEY);

    if (Helpers.var_check(localInvoiceQueue.data)) {
      localInvoiceQueue.data.push(localCurrentInvoice);  //insert
      saveDataIntoLocalStorage("invoice_queue", localInvoiceQueue.data); //insert into cache
      message.success("Invoice held", 3);
      saveDataIntoLocalStorage("current_invoice", null);   ///imp make empty current invoice
    }

    getSelectedInvoiceHistory(currentViewedInvoiceId);

  }

  
  const handlePrintQuickSaleInvoice = () => {
    //console.log("print");

    /*let printquickViewInvoiceDetails = JSON.parse(
      JSON.stringify(selectedQuickViewInvoiceData)
    );

    for (var key in selectedHistoryRecordData) {
      // check if the property/key is defined in the object itself, not in parent
      if (selectedHistoryRecordData.hasOwnProperty(key)) {
        //console.log(key, dictionary[key]);
        printquickViewInvoiceDetails[key] = selectedHistoryRecordData[key];
      }
    }

    setQuickViewInvoicePrintData(printquickViewInvoiceDetails);
    */
    printSalesOverview();

  }


  const printSalesOverview = () => {
    var previewSalesInvoiceHtml = document.getElementById("printSalesTable")
      .innerHTML;
    var doc =
      '<html><head><title></title><link rel="stylesheet" type="text/css" href="/printInvoice.scss" /></head><body onload="window.print(); window.close();">' +
      previewSalesInvoiceHtml +
      "</body></html>";
    /* NEW TAB OPEN PRINT */
    var popupWin = window.open("", "_blank");
    popupWin.document.open();
    // window.print(); window.close(); 'width: 80%, height=80%'
    popupWin.document.write(doc);
    //popupWin.document.close();  //vvimp for autoprint
  };


  const getSelectedInvoiceHistory = async (invoiceId) => {
    const getSaleHistoryResponse = await SalesApiUtil.getSalesInvoiceHistory(invoiceId);
    console.log('getSaleHistoryResponse:', getSaleHistoryResponse);

    if (getSaleHistoryResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', getSaleHistoryResponse.errorMessage);
      message.error(getSaleHistoryResponse.errorMessage, 3);
    }
    else {
      console.log('res -> ', getSaleHistoryResponse);
      message.success(getSaleHistoryResponse.message, 2);
      setSelectedInvoiceData(getSaleHistoryResponse);
      history.push({
        pathname: "/register/sell",
        selected_invoice_data: getSaleHistoryResponse,
      });


    }
  }



  const getSelectedQuickViewInvoiceHistory = async (invoiceId, tableRecord) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getSaleHistoryResponse = await SalesApiUtil.getSalesInvoiceHistory(invoiceId);
    console.log('getSaleHistoryResponse:', getSaleHistoryResponse);

    if (getSaleHistoryResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', getSaleHistoryResponse.errorMessage);
      message.error(getSaleHistoryResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', getSaleHistoryResponse);
      //message.success(getSaleHistoryResponse.message, 2);
      document.getElementById('app-loader-container').style.display = "none";
      let tableProducsData = getSaleHistoryResponse.invoices;
      /*---------------------------------------------------*/
      for (let i in tableProducsData) {
        if (Helpers.var_check(tableProducsData[i].qty))
          tableProducsData[i].qty = parseInt(tableProducsData[i].qty) > 0 ? parseInt(tableProducsData[i].qty)  : parseInt(tableProducsData[i].qty) * (-1) ;
        else tableProducsData[i].qty = 0;
        if (Helpers.var_check(tableProducsData[i].product_sale_price))
          tableProducsData[i].product_sale_price = parseFloat(
            parseFloat(tableProducsData[i].product_sale_price).toFixed(2)
          );
        else tableProducsData[i].product_sale_price = 0;

      } //enf of for loop


      /*---------------------------------------------------*/
      //console.log("imp", tableRecord);
      let invoiceData = JSON.parse(
        JSON.stringify(tableRecord)
      );
      //invoiceData.invoice_details = getSaleHistoryResponse.invoice_details;   no need now 
      invoiceData.products = tableProducsData;
      setSelectedQuickViewInvoiceData(tableProducsData);   //impp
  
      /*for (var key in tableRecord) {
        // check if the property/key is defined in the object itself, not in parent
        if (selectedHistoryRecordData.hasOwnProperty(key)) {
          //console.log(key, dictionary[key]);
          invoiceData[key] = tableRecord[key];
        }
      }*/

      //console.log("print-data", invoiceData);
  
      setQuickViewInvoicePrintData(invoiceData);
      /*---------------------------------------------------*/
      setIsQuickViewInvoiceModalVisible(true);     //imp false for to hide

    }
  }


  const handleCancelModal = () => {
    setIsViewInvoiceModalVisible(false);

  }

  const handleQuickViewCancelModal = () => {
    setIsQuickViewInvoiceModalVisible(false);

  }



  function handleChange(value) {
    setPaginationLimit(value);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchSalesHistoryData(value, 1);
    } else {
      fetchSalesHistoryData(value, currentPage);
    }
  }



  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchSalesHistoryData(paginationLimit, currentPg);
  }


  const showTotalItemsBar = (total, range) => {
    return `showed ${selectedTabData.length} from ${range[0]}-${range[1]} of ${total} items`
  };



  const ExportToCsv = async (e) => {

    if (salesHistoryData.length > 0) {
      document.getElementById('app-loader-container').style.display = "block";
      const getStoreResponse = await SalesApiUtil.getStoreId();
      if (getStoreResponse.hasError) {
        const errorMessage = getStoreResponse.errorMessage;
        console.log('Cant get Store Id -> ', errorMessage);
        message.error(errorMessage, 3);
        document.getElementById('app-loader-container').style.display = "none";
      } else {
        console.log("Success:", getStoreResponse.message);
        downloadParkedSalesInvoices(getStoreResponse || null);
      }
    }
    else { message.warning("Sales History Data Not Found", 3) } 

  }


  const downloadParkedSalesInvoices = async (fetchedStore) => {
    //console.log("fetchedStore", fetchedStore);
    const parkedSalesInvoicesExportResponse = await SalesApiUtil.exportParkedSalesInvoices(
      fetchedStore.store_id
    );
    console.log("Parked Sales Invoices export response:", parkedSalesInvoicesExportResponse);

    if (parkedSalesInvoicesExportResponse.hasError) {
      console.log(
        "Cant Export Parked Sales Invoices -> ",
        parkedSalesInvoicesExportResponse.errorMessage
      );
      message.error(parkedSalesInvoicesExportResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", parkedSalesInvoicesExportResponse.data);
      /*---------------csv download--------------------------------*/
      if (mounted) {     //imp if unmounted
        // CSV FILE
        let csvFile = new Blob([parkedSalesInvoicesExportResponse.data], { type: "text/csv" });
        let url = window.URL.createObjectURL(csvFile);
        let a = document.createElement('a');
        a.href = url;
        a.download = "parked_sales_invoices_" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
        /*---------------csv download--------------------------------*/
        message.success(parkedSalesInvoicesExportResponse.message, 3);
        document.getElementById('app-loader-container').style.display = "none";
      }

    }

  }



  const getUserStoreData = async (storeId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getOutletViewResponse = await SetupApiUtil.getOutlet(storeId);
    console.log('getOutletViewResponse:', getOutletViewResponse);

    if (getOutletViewResponse.hasError) {
      console.log('Cant fetch Store Data -> ', getOutletViewResponse.errorMessage);
      //message.warning(getOutletViewResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', getOutletViewResponse);
      let selectedStore = getOutletViewResponse.outlet;
      //message.success(getOutletViewResponse.message, 3);
      getTemplateData(selectedStore.template_id);   //imp to get template data

    }
  }



  const getTemplateData = async (templateId) => {
    
    const getTepmlateResponse = await SetupApiUtil.getTemplate(templateId);
    console.log('getTepmlateResponse:', getTepmlateResponse);

    if (getTepmlateResponse.hasError) {
      console.log('Cant get template Data -> ', getTepmlateResponse.errorMessage);
      //message.warning(getTepmlateResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', getTepmlateResponse);
      var receivedTemplateData = getTepmlateResponse.template;
      //message.success(getTepmlateResponse.message, 3);
      setTemplateData(receivedTemplateData);
      document.getElementById('app-loader-container').style.display = "none";

    }
  } 



 


  const OptionsDropdown = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={() => history.push({ pathname: "/register/sell" })}
      >
        <a>New Sale</a>
      </Menu.Item>
      <Menu.Divider />


    </Menu>
  );

  return (
    <div className='page sales-history'>
      <div className='page__header'>
        <h1>Sale History</h1>

        <div className="page__header__buttons">
          {currentTab === salesHistoryEnum.CONTINUE &&
            <Button type='primary'
              className='custom-btn custom-btn--primary'
              icon={<DownloadOutlined />}
              onClick={ExportToCsv}
            >
              Export CSV
        </Button>}

          <Dropdown overlay={OptionsDropdown} trigger={["click"]}>
            <Button
              type="Default"
              icon={<DownOutlined />}
              onClick={(e) => e.preventDefault()}
            >
              More <ProfileOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className='page__content'>

        <div className="action-row">
          <div className="action-row__element">
            Show
            <Select
              defaultValue="20"
              style={{ width: 120, margin: "0 5px" }}
              onChange={handleChange}
            >
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
              <Option value="100">100</Option>
            </Select>
            entries
          </div>

          <div className="action-row__element">
            <Search
              placeholder="search sales history"
              allowClear
              size="middle"
              onChange={onSearch}
            />
          </div>
        </div>

        <div className="sales-history-pagination">
          <Pagination
            total={paginationData && paginationData.totalElements}
            showTotal={(total, range) => showTotalItemsBar(total, range)}
            defaultPageSize={20}
            current={currentPage}
            pageSize={parseInt(paginationLimit)}
            showSizeChanger={false}
            position="topRight"
            onChange={(page, pageSize) => handlePageChange(page, pageSize)}

          />
        </div>


        <Divider />

        <Tabs activeKey={currentTab} onChange={handletabChange}>

          <TabPane tab='Continue Sales' key='continue-sales'>
            {/* Table */}
            <div className='table'>
              <SellHistoryNestedProductsTable
                tableData={selectedTabData}
                pageLimit={paginationLimit}
                paginationData={paginationData}
                tableDataLoading={loading}
                //onClickPageChanger={handlePageChange}
                onInvoiceSelection={handleInvoiceSelection}
                tableType={salesHistoryEnum.CONTINUE} />
            </div>
            {/* Table */}
          </TabPane>

          <TabPane tab='Process Returns' key='process-returns'>
            {/* Table */}
            <div className='table'>
              <SellHistoryNestedProductsTable
                tableData={selectedTabData}
                tableDataLoading={loading}
                pageLimit={paginationLimit}
                paginationData={paginationData}
                onInvoiceSelection={handleInvoiceSelection}
                onInvoiceQuickViewSelection={handleInvoiceQuickViewSelection}
                tableType={salesHistoryEnum.PROCESS} />
            </div>
            {/* Table */}
          </TabPane>

          <TabPane tab='All Sales' key='all-sales'>
            {/* Table */}
            <div className='table'>
              <SellHistoryNestedProductsTable
                tableData={selectedTabData}
                pageLimit={paginationLimit}
                paginationData={paginationData}
                tableDataLoading={loading}
                onInvoiceSelection={handleInvoiceSelection}
                onInvoiceQuickViewSelection={handleInvoiceQuickViewSelection}
                tableType={salesHistoryEnum.ALL} />
            </div>
            {/* Table */}
          </TabPane>

        </Tabs>

        {/*--Modal for navigation to register screen*/}
        <Modal title="Hold up! You currently have a sale in progress"
          visible={isViewInvoiceModalVisible}
          onCancel={handleCancelModal}
          footer={[
            <Button key="back" onClick={returnToSaleInProgress}
            >
              Return to sale in progress
            </Button>,
            <Button key="submit" type="primary" //loading={loading} 
              className="custom-btn--primary" onClick={saveAndContinue}
            >
              Save and Continue
            </Button>
          ]}
        >
          <p> You have a sale on the Sell screen that hasn’t been completed.
          You can choose to return to that sale to complete it,
              or save that sale and continue with this one.</p>


        </Modal>

        {/*--Modal for navigation to register screen*/}


        {/*--Modal for quick view functionality*/}
        <Modal title={`Invoice Sale Data ( invoice-id-${quickViewInvoicePrintData && quickViewInvoicePrintData.invoice_show_id} , 
          ${moment(quickViewInvoicePrintData
          &&
          quickViewInvoicePrintData.invoice_datetime).format("ddd MMM, yyyy HH:mm A")} )`}
          wrapClassName='quick-view-modal-dailog'
          visible={isQuickViewInvoiceModalVisible}
          onCancel={handleQuickViewCancelModal}
          onOk={handleQuickViewCancelModal}
          width={700}
          footer={[
            <Button key="back" onClick={handleQuickViewCancelModal}
            >
              Cancel
            </Button>,
            <Button key="submit" type="primary" //loading={loading} 
              className="custom-btn--primary" onClick={handlePrintQuickSaleInvoice}
            >
              Print
            </Button>
          ]}

        >

          {/* Table */}
          {<div className='table'>
            <SellNestedQuickViewProductsTable
              tableData={selectedQuickViewInvoiceData}
              //tableDataLoading={loading}
              onChangeProductsData={handleInvoiceQuickViewSelection}
            />
          </div>}
          {/* Table */}

          <Row style={{ textAlign: "center", marginTop: "2rem" }}>
            <Col xs={24} sm={24} md={6} offset={12}>
              <span> SUB-TOTAL: </span>
            </Col>
            <Col xs={24} sm={24} md={6} >
              <span> {selectedHistoryRecordData && parseFloat(selectedHistoryRecordData.sale_total).toFixed(2)} </span>
            </Col>
            {/*-------------------------------------------*/}

            <Col xs={24} sm={24} md={6} offset={12}>
              <span> Discount: </span>
            </Col>
            <Col xs={24} sm={24} md={6} >
              <span> {selectedHistoryRecordData && parseFloat(selectedHistoryRecordData.discounted_amount).toFixed(2)} </span>
            </Col>
            {/*-------------------------------------------*/}

            <Col xs={24} sm={24} md={6} offset={12}>
              <span> Tax: </span>
            </Col>
            <Col xs={24} sm={24} md={6} >
              <span> {selectedHistoryRecordData && parseFloat(selectedHistoryRecordData.tax_total).toFixed(2)} </span>
            </Col>
            {/*-------------------------------------------*/}
            <Col xs={24} sm={24} md={6} offset={12}>
              <span> Total: </span>
            </Col>
            <Col xs={24} sm={24} md={6} >
              <span> {selectedHistoryRecordData &&
               parseFloat((parseFloat(selectedHistoryRecordData.sale_total)+parseFloat(selectedHistoryRecordData.tax_total)) - parseFloat(selectedHistoryRecordData.discounted_amount)).toFixed(2)
              } </span>
            </Col>

          </Row>



        </Modal>

        {/*--Modal for navigation to register screen*/}


      </div>


      {/* print sales overview */}
      {quickViewInvoicePrintData && (
        <PrintSalesInvoiceTable
          user={localStorageData}
          selectedOutletTemplateData={templateData}
          invoice={quickViewInvoicePrintData}
          invoiceType={"quick_view"}
        />
      )}


    </div>
    
  );
};

export default SalesHistory;
