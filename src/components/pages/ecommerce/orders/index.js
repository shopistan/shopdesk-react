
import React, { useEffect, useState } from "react";
import "../style.scss";
import { Tabs, Menu, Dropdown, Button, Input, Select, message, Pagination } from "antd";
import { useHistory } from "react-router-dom";
import OmniSalesOrders from "./omniSalesOrders";
import PrintSalesOrders from "./omniSalesOrders/printSalesOrder";
import { ProfileOutlined, DownOutlined } from "@ant-design/icons";
import * as EcommerceApiUtil from '../../../../utils/api/ecommerce-api-utils';
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import Constants from '../../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";



const { TabPane } = Tabs;




function EcommerceOrders() {
  const { Search } = Input;
  const { Option } = Select;
  const history = useHistory();
  const [paginationLimit, setPaginationLimit] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("All Orders");
  const [omniSalesOrdersData, setOmniSalesOrdersData] = useState([]);
  const [dataSearched, setDataSearched] = useState([]);
  const [dataSearchedAccumulate, setDataSearchedAccumulate] = useState([]);
  const [selectedTabData, setSelectedTabData] = useState([]);
  const [userLocalStorageData, setUserLocalStorageData] = useState(null);
  const [selectedSaleOrdersRowKeys, setSelectedSaleOrdersRowKeys] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [outletData, setOutletData] = useState(null);
  const [selectedSalesInvoiceBulkDataArr, setSelectedSalesInvoiceBulkDataArr] = useState([]);



  var mounted = true;

  const omniSalesOrdersEnum = { SALE: "3", COMPLETED: "4" }
  const omniSalesTabsEnum = { ALL: "All Orders", SALE: "Sale Orders", COMPLETED: "Completed Orders" }


  useEffect(() => {

    fetchSalesOrdersData();
    /*--------------set user local data-------------------------------*/
    var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    setUserLocalStorageData(readFromLocalStorage);
    getUserStoreData(readFromLocalStorage.auth.current_store);      //new one imp to get user outlet data
    /*--------------set user local data-------------------------------*/

    return () => {
      mounted = false;
    }

  }, []);  //imp to render when history prop changes




  const fetchSalesOrdersData = async (pageLimit = 100, pageNumber = 1) => {

    document.getElementById('app-loader-container').style.display = "block";
    const omniSalesOrdersViewResponse = await EcommerceApiUtil.getAllOmniSales(
      pageLimit,
      pageNumber,
    );
    console.log('omniSalesOrdersViewResponse:', omniSalesOrdersViewResponse);

    if (omniSalesOrdersViewResponse.hasError) {
      console.log('Cant fetch Omni Sales Orders Data -> ', omniSalesOrdersViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.warning(omniSalesOrdersViewResponse.errorMessage, 3);
    }
    else {
      console.log('res -> ', omniSalesOrdersViewResponse);
      if (mounted) {     //imp if unmounted
        var omniSalesData = omniSalesOrdersViewResponse.invoices.data || omniSalesOrdersViewResponse.invoices;
        setOmniSalesOrdersData(omniSalesData);
        setPaginationData(omniSalesOrdersViewResponse.invoices.page || {});
        /*-------setting sales data selection---------*/
        handletabChangeData(omniSalesData); //imp
        /*-------setting continue sales data---------*/
        /*----------handle data serching response------------*/
        handledSearchedDataResponse(omniSalesData);
        /*-----------handle data serching response-----------*/
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(omniSalesOrdersViewResponse.message, 3);
      }
    }
  }


  function handledSearchedDataResponse(dataResponse) {
    var newData = [...dataSearched];
    let foundIndex = -1; 
    dataResponse.forEach(item => {
      var foundObj = newData.find((obj, index) => {
        foundIndex = index;
        return obj.invoice_id === item.invoice_id;
      });

      if (!foundObj) {
        newData.push(item);
      }
      else {
        if (foundIndex > -1) {
          newData.splice(foundIndex, 1, item);
        }
      }

    });
    //console.log(newData);
    setDataSearched(newData);
    handleAccumulateSearchedData(currentTab, newData); //imp
  }



  const handleAccumulateSearchedData = (currentTabKey, searchedDataRecordsAccumulate) => {
    let filteredData;
    if (currentTabKey === omniSalesTabsEnum.SALE) {
      filteredData = searchedDataRecordsAccumulate.filter((sale) => {
        return sale.invoice_status === omniSalesOrdersEnum.SALE;
      });
      setDataSearchedAccumulate(filteredData);
    }

    if (currentTabKey === omniSalesTabsEnum.COMPLETED) {
      filteredData = searchedDataRecordsAccumulate.filter((sale) => {
        return sale.invoice_status === omniSalesOrdersEnum.COMPLETED;
      });
      setDataSearchedAccumulate(filteredData);
    }

    if (currentTabKey === omniSalesTabsEnum.ALL) {
      setDataSearchedAccumulate(searchedDataRecordsAccumulate);
    }

  };



  const handletabChangeData = (omniSalesDataRecords) => {
    var filteredData;
    if (currentTab === omniSalesTabsEnum.SALE) {
      filteredData = omniSalesDataRecords.filter((sale) => {
        return sale.invoice_status === omniSalesOrdersEnum.SALE;
      });
      //console.log(filteredData);
      setSelectedTabData(filteredData);
    }

    if (currentTab === omniSalesTabsEnum.COMPLETED) {
      filteredData = omniSalesDataRecords.filter((sale) => {
        return sale.invoice_status === omniSalesOrdersEnum.COMPLETED;
      });
      setSelectedTabData(filteredData);
    }

    if (currentTab === omniSalesTabsEnum.ALL) {
      setSelectedTabData(omniSalesDataRecords);
    }

  };



  const handletabChange = (key) => {
    //console.log(key);
    var filteredData;
    if (key === omniSalesTabsEnum.SALE) {
      filteredData = omniSalesOrdersData.filter((sale) => {
        return sale.invoice_status === omniSalesOrdersEnum.SALE;
      });
      setSelectedTabData(filteredData);
    }

    if (key === omniSalesTabsEnum.COMPLETED) {
      filteredData = omniSalesOrdersData.filter((sale) => {
        return sale.invoice_status === omniSalesOrdersEnum.COMPLETED;
      });
      setSelectedTabData(filteredData);
    }

    if (key === omniSalesTabsEnum.ALL) {
      setSelectedTabData(omniSalesOrdersData);
    }

    setCurrentTab(key);
    handleAccumulateSearchedData(key, dataSearched);  //imp

  };



  const onSearch = (e) => {
    var currValue = e.target.value;
    currValue = currValue.toLowerCase();

    if (currValue === "") {
      fetchSalesOrdersData(paginationLimit, currentPage);
    } else {
      const filteredData = dataSearchedAccumulate.filter((entry) => {
        var invoiceRegion = entry.invoice_region;
        invoiceRegion = invoiceRegion.toLowerCase();
        var invoiceId = entry.invoice_reference_id;
        invoiceId = invoiceId.toLowerCase();
        var invoiceMethod = entry.invoice_method;
        invoiceMethod = invoiceMethod.toLowerCase();
        var invoiceShippingMethod = entry.invoice_shipping_method;
        invoiceShippingMethod = invoiceShippingMethod.toLowerCase();


        return invoiceRegion.includes(currValue) ||
          invoiceId.includes(currValue) ||
          invoiceMethod.includes(currValue) ||
          invoiceShippingMethod.includes(currValue);

      });

      setSelectedTabData(filteredData);

    }
  };



  function handleSaleOrderSelection(selectedRowKeys, selectedRows) {
    setSelectedSaleOrdersRowKeys(selectedRowKeys);

  }


  const confirmOeSalesOrders = async (selectedOeSalesOrders) => {

    document.getElementById('app-loader-container').style.display = "block";
    const confirmOeSalesOrdersResponse = await EcommerceApiUtil.confirmOeSalesOrders(selectedOeSalesOrders);
    console.log('confirmOeSalesOrdersResponse:', confirmOeSalesOrdersResponse);

    if (confirmOeSalesOrdersResponse.hasError) {
      console.log('Cant Confirm Oe Sales Orders Data -> ', confirmOeSalesOrdersResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.warning(confirmOeSalesOrdersResponse.errorMessage, 3);
    }
    else {
      if (mounted) {     //imp if unmounted
        //document.getElementById('app-loader-container').style.display = "none";   //imp but prev ver
        //message.success(confirmOeSalesOrdersResponse.message, 3);
        //fetchSalesOrdersData(paginationLimit, currentPage);                       //imp but prev ver
  
      }
    }
  }



  const fetchOeSaleOrderDataInBulk = async (invoice_id) => {

    const fetchOeSaleOrderViewResponse = await EcommerceApiUtil.getOeSaleOrderData(invoice_id);
    console.log('fetchOeSaleOrderViewResponse:', fetchOeSaleOrderViewResponse);

    if (fetchOeSaleOrderViewResponse.hasError) {
        console.log('Cant fetch Oe Sales Orders Data -> ', fetchOeSaleOrderViewResponse.errorMessage);
        document.getElementById('app-loader-container').style.display = "none";
        message.error(fetchOeSaleOrderViewResponse.errorMessage, 3);

    }
    else {
        if (mounted) {     //imp if unmounted
          let invoiceResponseData = {};
          invoiceResponseData.customer_info = fetchOeSaleOrderViewResponse.customer_info;
          invoiceResponseData.invoice_data = fetchOeSaleOrderViewResponse.invoice_data; 
          invoiceResponseData.invoice_products = fetchOeSaleOrderViewResponse.invoice_products;
          return invoiceResponseData;

        }
    }

}




  const fetchOeSalesOrdersRequest = async () => {

    document.getElementById('app-loader-container').style.display = "block";
    const fetchOeSalesOrdersResponse = await EcommerceApiUtil.fetchOeSalesOrders();
    console.log('fetchOeSalesOrdersResponse:', fetchOeSalesOrdersResponse);

    if (fetchOeSalesOrdersResponse.hasError) {
      console.log('Cant Confirm Oe Sales Orders Data -> ', fetchOeSalesOrdersResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.warning(fetchOeSalesOrdersResponse.errorMessage, 3);
      
    }
    else {
      console.log('res -> ', fetchOeSalesOrdersResponse);

      if (mounted) {     //imp if unmounted
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(fetchOeSalesOrdersResponse.message, 3);
        fetchSalesOrdersData();   //imp to fetch again
        
      }
    }
  }



  const makeOeSaleOrderInvoice = async () => {
    if (selectedSaleOrdersRowKeys.length === 0) {
      message.warning("Please Select a Sale Order", 3);
    }
    else {
      await confirmOeSalesOrders(selectedSaleOrdersRowKeys);   //imp await is neccessary
      window.location.reload();                                //new one should be at the last
    }

  }



  const makeOeSaleOrderInvoiceInBulk = async () => {
    if (selectedSaleOrdersRowKeys.length === 0) {
      message.warning("Please Select a Sale Order", 3);
    }
    else {
      await confirmOeSalesOrders(selectedSaleOrdersRowKeys);    //imp to set it's status to complete //imp await is neccessary
      //console.log(selectedSaleOrdersRowKeys);
      let bulkSalesInvoiceDataArr = [];
      document.getElementById('app-loader-container').style.display = "block";
      for (let i=0; i<selectedSaleOrdersRowKeys.length; i++) {
        bulkSalesInvoiceDataArr[i] = await fetchOeSaleOrderDataInBulk(selectedSaleOrdersRowKeys[i]);
      }
      document.getElementById('app-loader-container').style.display = "none";
      //console.log("final-bulk", bulkSalesInvoiceDataArr);
      setSelectedSalesInvoiceBulkDataArr(bulkSalesInvoiceDataArr);    //imp to set array here
      downloadInvoicesInHtml();                                       //imp
      window.location.reload();                                       //new one should be at the last

    }

  }



  function downloadInvoicesInHtml() {
    let doc = document.getElementById("printSalesInvoiceBulkView").innerHTML;
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
    element.setAttribute('download', "sales_invoices_bulk" + new Date().toUTCString() + ".html");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      setOutletData(selectedStore);

    }
  }



  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setLoading(true);
    fetchSalesOrdersData(paginationLimit, page);
  };


  const showTotalItemsBar = (total, range) => {
    return `showed ${selectedTabData.length} from ${range[0]}-${range[1]} of ${total} items`
  };



  const saleOrdrsMenu = (
    <Menu>
      <Menu.Item key="0"
        onClick={fetchOeSalesOrdersRequest}
      >
        Fetch Orders
      </Menu.Item>
    </Menu>
  );



  return (
    <>

    {/* print sales overview */}
    {(selectedSalesInvoiceBulkDataArr && selectedSalesInvoiceBulkDataArr.length >=2  ) && (
      <PrintSalesOrders
        SalesInvoiceDataArr={selectedSalesInvoiceBulkDataArr}
        selectedOutlet={outletData && outletData}
        
      />
    )}

    <div className="page ecom-orders">
      <div className="page__header">
        <h1>Ecommerce</h1>

        <div className="page__header__buttons">
          <Dropdown overlay={saleOrdrsMenu} trigger={["click"]}>
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


      <div className="page__content omni-sales-orders">
        <div className="search">
          {selectedSaleOrdersRowKeys.length <=1 && <Button type="primary"
            onClick={makeOeSaleOrderInvoice}
          >Make Invoice
          </Button>}
          {selectedSaleOrdersRowKeys.length >=2 && <Button type="primary"
            onClick={makeOeSaleOrderInvoiceInBulk}
          >Bulk Invoice
          </Button>}
          <Search
            allowClear
            size="middle"
            onChange={onSearch}
            style={{ width: 300 }}
          />
        </div>

        <div className="search omni-sales-pagination">
          <Pagination
            total={paginationData && paginationData.totalElements}
            showTotal={(total, range) => showTotalItemsBar(total, range)}
            defaultPageSize={100}
            current={currentPage}
            pageSize={parseInt(paginationLimit)}
            showSizeChanger={false}
            position="topRight"
            onChange={(page, pageSize) => handlePageChange(page, pageSize)}

          />
        </div>


        <Tabs activeKey={currentTab} onChange={handletabChange}>
          <TabPane tab="All Orders" key="All Orders">
            <OmniSalesOrders
              data={selectedTabData}
              paginationLimit={paginationLimit}
              paginationDataObj={paginationData}
              tableLoading={loading}
              onSaleOrderSelection={handleSaleOrderSelection}
              tableDataType={omniSalesTabsEnum.ALL}
              //currencySymbol={userLocalStorageData && userLocalStorageData.currency.symbol}    //imp prev ver
              currencySymbol={outletData && outletData.currency_symbol}
            />
          </TabPane>
          <TabPane tab="Sale Orders" key="Sale Orders">
            <OmniSalesOrders
              data={selectedTabData}
              paginationLimit={paginationLimit}
              paginationDataObj={paginationData}
              tableLoading={loading}
              onSaleOrderSelection={handleSaleOrderSelection}
              tableDataType={omniSalesTabsEnum.SALE}
              //currencySymbol={userLocalStorageData && userLocalStorageData.currency.symbol}
              currencySymbol={outletData && outletData.currency_symbol}
            />
          </TabPane>
          <TabPane tab="Completed Orders" key="Completed Orders">
            <OmniSalesOrders
              data={selectedTabData}
              paginationLimit={paginationLimit}
              paginationDataObj={paginationData}
              tableLoading={loading}
              onSaleOrderSelection={handleSaleOrderSelection}
              tableDataType={omniSalesTabsEnum.COMPLETED}
              //currencySymbol={userLocalStorageData && userLocalStorageData.currency.symbol}
              currencySymbol={outletData && outletData.currency_symbol}
            />
          </TabPane>
        </Tabs>

      </div>
    </div>

     

    </>

  );
}

export default EcommerceOrders;
