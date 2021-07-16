
import React, { useEffect, useState } from "react";
import { Button, Tabs, Menu, Dropdown, DatePicker, Divider } from "antd";
import { ProfileOutlined, DownOutlined, BarsOutlined, DownloadOutlined } from "@ant-design/icons";
import PurchaseOrders from "./Po";
import InventoryTransfers from "./Transfer";
import StockAdjustment from "./Adjustment";
import StockReturned from "./ReturnedStock";
import Constants from '../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import { useHistory } from "react-router-dom";
import moment from 'moment';

const dateFormat = "YYYY-MM-DD";

const { TabPane } = Tabs;



function Stock(props) {
  const history = useHistory();
  const [userLocalStorageData, setUserLocalStorageData] = useState(null);
  const [selectedDates, setselectedDates] = useState([]);
  const [selectedDatesRange, setselectedDatesRange] = useState([]);
  const [exportCsvCheck, setExportCsvCheck] = useState(false);


  const todayDate = moment();
  const { RangePicker } = DatePicker;

  const { activeKey = "" } = props;
  //const [currentTab, setCurrentTab] = useState("");

  //console.log("props", props);


  useEffect(() => {
    /*if(history.location.activeKey){
      setCurrentTab(history.location.activeKey);
    }
    else{
      //console.log(window.location.pathname);
      var path = (window.location.pathname).split("/");
      //console.log(path);
      setCurrentTab(path[2]); 
    } */

    /*--------------set user local data-------------------------------*/
    var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    setUserLocalStorageData(readFromLocalStorage);
    /*--------------set user local data-------------------------------*/


  }, [history.location.activeKey]);  //imp to render when history prop changes

  

  const handletabChange = (key) => {
    //setCurrentTab(key);  // previous imp
    history.push({
      pathname: `/stock-control/${key}`,
      activeKey: key
    })
  };


  
  const stockScopeFilter = (localUserInfo) => {
    if (!localUserInfo) { return; }
    if (localUserInfo.user_role == 'cashier' || localUserInfo.user_role == 'shop_manager') {
      return false;
    }
    else {
      return true;
    }

  };



  const handleRangePicker = (values) => {
    if (values) {
      let startDate = moment(values[0]).format(dateFormat);
      let endDate = moment(values[1]).format(dateFormat);
      setselectedDates([startDate, endDate]);
    }
  };

  const fetchSalesHistoryWithDateRange = (e) => {
    let dates = [...selectedDates];
    setExportCsvCheck(false);
    setselectedDatesRange(dates);
  };


  const ExportToCsv = () => {
    let dates = [...selectedDates];
    setExportCsvCheck(true);
    setselectedDatesRange(dates);   //imp to set here too for rerendering childs
  };



  const OptionsDropdown = (
    <Menu>

      {userLocalStorageData && stockScopeFilter(userLocalStorageData.user_info || null) &&
        <Menu.Item
          key="0"
          onClick={() => history.push({ pathname: "/stock-control/purchase-orders/add" })}
        >
          <a>Order Stock</a>
        </Menu.Item>}

      <Menu.Divider />
      
      {userLocalStorageData && stockScopeFilter(userLocalStorageData.user_info || null) &&
        <Menu.Item
          key="1"
          onClick={() => history.push({ pathname: "/stock-control/return-stock/add" })}
        >
          Return Stock
      </Menu.Item>}

      <Menu.Divider />
      <Menu.Item
        key="2"
        onClick={() => history.push({ pathname: "/stock-control/inventory-transfers/add" })}
      >
        Transfer Inventory
      </Menu.Item>
      <Menu.Divider />

      {userLocalStorageData && stockScopeFilter(userLocalStorageData.user_info || null) &&
        <Menu.Item
          key="3"
          onClick={() => history.push({ pathname: "/stock-control/stock-adjustments/add" })}
        >
          Stock Adjustment
      </Menu.Item>}

    </Menu>
  );




  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Stock Control</h1>

        <div className="page__header__buttons">

          <Button type='primary'
            className='custom-btn custom-btn--primary'
            icon={<DownloadOutlined />}
            onClick={ExportToCsv}
          >
            Export CSV
          </Button>

          <Dropdown overlay={OptionsDropdown}
            placement="bottomCenter" trigger={["click"]}>
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


      <div className="page__content stock-control">

        <div className='action-row stock-transfer-row-date-picker'>
          <RangePicker
            className='date-picker'
            onCalendarChange={handleRangePicker}
            defaultValue={[todayDate, todayDate]}
          />
          <Button
            type='primary'
            icon={<BarsOutlined />}
            onClick={fetchSalesHistoryWithDateRange}
            className='custom-btn custom-btn--primary'
          >
            Fetch
            </Button>
        </div>
        <Divider />


        <Tabs activeKey={activeKey && activeKey} onChange={handletabChange}>

          {userLocalStorageData && stockScopeFilter(userLocalStorageData.user_info || null) &&
            <TabPane tab="Purchase Orders" key="purchase-orders">
              <PurchaseOrders selectedDates={selectedDatesRange} exportTransferCheck={exportCsvCheck}  />
            </TabPane>}

          <TabPane tab="Inventory Transfers" key="inventory-transfers">
            <InventoryTransfers selectedDates={selectedDatesRange} exportTransferCheck={exportCsvCheck} />
          </TabPane>

          {userLocalStorageData && stockScopeFilter(userLocalStorageData.user_info || null) &&
            <TabPane tab="Stock Adjustment" key="stock-adjustments">
              <StockAdjustment selectedDates={selectedDatesRange} exportTransferCheck={exportCsvCheck}  />
            </TabPane>}

          {userLocalStorageData && stockScopeFilter(userLocalStorageData.user_info || null) &&
            <TabPane tab="Returned Stock" key="returned-stock">
              <StockReturned selectedDates={selectedDatesRange} exportTransferCheck={exportCsvCheck}  />
            </TabPane>}

        </Tabs>
      </div>
    </div>
  );
}

export default Stock;
