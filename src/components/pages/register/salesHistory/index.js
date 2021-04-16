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
}
  from "antd";
import { PlusCircleOutlined, ProfileOutlined, DownOutlined } from "@ant-design/icons";
import * as SalesApiUtil from '../../../../utils/api/sales-api-utils';
import { useHistory } from "react-router-dom";
import * as Helpers from "../../../../utils/helpers/scripts";
import SellHistoryNestedProductsTable from "../../../organism/table/sell/sellHistoryProductsTable";
import {
  getSellInvoiceDataFromLocalStorage,
  saveDataIntoLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../utils/constants/constants';



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
  const [selectedInvoiceData, setSelectedInvoiceData] = useState("");
  const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] = useState(false);
  const [localCurrentInvoice, setLocalCurrentInvoice] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataSearched, setDataSearched] = useState([]);
  const [dataSearchedAccumulate, setDataSearchedAccumulate] = useState([]);


  var mounted = true;


  const salesTypeEnum = { PARKED: "1", COMPLETED: "0" }
  const salesHistoryEnum = { CONTINUE: "continue-sales", PROCESS: "process-returns", ALL: "all-sales" }


  useEffect(() => {

    fetchSalesHistoryData();

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
    const salesHistoryViewResponse = await SalesApiUtil.getSalesHistory(
      pageLimit,
      pageNumber,
      salesListLimitCheck
    );
    console.log('salesHistoryViewResponse:', salesHistoryViewResponse);

    if (salesHistoryViewResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', salesHistoryViewResponse.errorMessage);
      message.error(salesHistoryViewResponse.errorMessage, 3);
      setLoading(false);
    }
    else {
      console.log('res -> ', salesHistoryViewResponse);
      if (mounted) {     //imp if unmounted
        var salesData = salesHistoryViewResponse.invoices.data || salesHistoryViewResponse.invoices;
        message.success(salesHistoryViewResponse.message, 3);
        setSalesHistoryData(salesData);
        setPaginationData(salesHistoryViewResponse.invoices.page || {});
        /*-------setting sales data selection---------*/
        handletabChangeData(salesData); //imp
        /*-------setting continue sales data---------*/
         /*----------handle data serching response------------*/
         handledSearchedDataResponse(salesData);
         /*-----------handle data serching response-----------*/
        setLoading(false);
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


  const getSelectedInvoiceHistory = async (invoiceId) => {
    const hide = message.loading('Getting Invoice in progress..', 0);
    const getSaleHistoryResponse = await SalesApiUtil.getSalesInvoiceHistory(invoiceId);
    console.log('getSaleHistoryResponse:', getSaleHistoryResponse);

    if (getSaleHistoryResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', getSaleHistoryResponse.errorMessage);
      message.error(getSaleHistoryResponse.errorMessage, 3);
      setTimeout(hide, 1000);
    }
    else {
      console.log('res -> ', getSaleHistoryResponse);
      message.success(getSaleHistoryResponse.message, 2);
      setSelectedInvoiceData(getSaleHistoryResponse);
      setTimeout(hide, 1000);
      history.push({
        pathname: "/register/sell",
        selected_invoice_data: getSaleHistoryResponse,
      });


    }
  }



  const handleCancelModal = () => {
    setIsViewInvoiceModalVisible(false);

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
              defaultValue="10"
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
              onClick={saveAndContinue}
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


      </div>
    </div>
  );
};

export default SalesHistory;
