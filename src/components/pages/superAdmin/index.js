
import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, Tabs, Divider, DatePicker } from "antd";
import { BarsOutlined } from "@ant-design/icons";
import SaPurchaseOrders from "./Po";
import SaInventoryTransfers from "./Transfer";
import Constants from '../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import { useHistory } from "react-router-dom";
import moment from 'moment';


const dateFormat = "YYYY-MM-DD";

const { TabPane } = Tabs;



function SuperAdminStock(props) {
  const history = useHistory();
  const [, setUserLocalStorageData] = useState(null);
  const [selectedDates, setselectedDates] = useState([]);
  const [fetchButtonActiveCheck, setFetchButtonActiveCheck] = useState(true);


  const { RangePicker } = DatePicker;
  const { activeKey = "" } = props;
  //console.log("props", props);


  useEffect(() => {

    /*--------------set user local data-------------------------------*/
    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    setUserLocalStorageData(readFromLocalStorage);
    /*--------------set user local data-------------------------------*/


  }, [activeKey]);  //imp to render when history prop changes



  const handleRangePicker = (values) => {

    if (values) {
      let startDate = moment(values[0]).format(dateFormat);
      let endDate = moment(values[1]).format(dateFormat);
      setselectedDates([startDate, endDate]);
      setFetchButtonActiveCheck(false);
    }

  };

  const fetchSalesHistoryWithDateRange = (e) => {
    setFetchButtonActiveCheck(true);
  };



  const handletabChange = (key) => {
    //setCurrentTab(key);  // previous imp 
    history.push({
      pathname: `/super-admin/stock-control/${key}`,
      activeKey: key
    })
  };






  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Super Admin <small>- Stock Control</small></h1>

      </div>


      <div className="page__content sa-stock-control">

        {activeKey === "inventory-transfers" && <div className='action-row stock-transfer-row-date-picker'>
          <RangePicker
            className='date-picker'
            onCalendarChange={handleRangePicker}
          />
          <Button
            type='primary'
            icon={<BarsOutlined />}
            onClick={fetchSalesHistoryWithDateRange}
            className='custom-btn custom-btn--primary'
          >
            Fetch
          </Button>
        </div>}

        <Divider />

        <Tabs activeKey={activeKey && activeKey} onChange={handletabChange}>
          <TabPane tab="Purchase Orders" key="purchase-orders">
            <SaPurchaseOrders />
          </TabPane>

          <TabPane tab="Inventory Transfers" key="inventory-transfers">
            <SaInventoryTransfers selectedDates={ fetchButtonActiveCheck ? selectedDates : null} />
          </TabPane>

        </Tabs>

      </div>
    </div>
  );
}

export default SuperAdminStock;
