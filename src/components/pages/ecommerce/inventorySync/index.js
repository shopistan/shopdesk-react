import React, { useEffect, useState } from "react";
import { Tabs, Menu, Dropdown, Button, message } from "antd";
import { ProfileOutlined, DownOutlined } from "@ant-design/icons";
import OmniInventorySyncTable from "../../../organism/table/ecommerce/omniAllInventorySyncTable";
import * as EcommerceApiUtil from '../../../../utils/api/ecommerce-api-utils';
import { useHistory } from "react-router-dom";



const InventorySync = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [paginationLimit, setPaginationLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({});
  const [omniInventorySyncData, setOmniInventorySyncData] = useState(null);


  var mounted = true;



  useEffect(() => {
    fetchOmniAlInventorySync();

    return () => {
      mounted = false;
    }

  }, []);




  const fetchOmniAlInventorySync = async (pageLimit = 25, pageNumber = 1) => {

    document.getElementById('app-loader-container').style.display = "block";
    const fetchOmniAlInventorySyncResponse = await EcommerceApiUtil.getOmniAlInventorySync(
      pageLimit,
      pageNumber
    );
    console.log('fetchOmniAlInventorySyncResponse:', fetchOmniAlInventorySyncResponse);

    if (fetchOmniAlInventorySyncResponse.hasError) {
      console.log('Cant fetch Omni Inventory Sync Data -> ', fetchOmniAlInventorySyncResponse.errorMessage);
      message.error(fetchOmniAlInventorySyncResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', fetchOmniAlInventorySyncResponse);
      if (mounted) {     //imp if unmounted
        var omniInventorySyncData = fetchOmniAlInventorySyncResponse.Inventory.data || fetchOmniAlInventorySyncResponse.Inventory;
        console.log(omniInventorySyncData);
        setOmniInventorySyncData(omniInventorySyncData);
        setPaginationData(fetchOmniAlInventorySyncResponse.Inventory.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(fetchOmniAlInventorySyncResponse.message, 3);
      }
    }

  }



  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setLoading(true);
    fetchOmniAlInventorySync(paginationLimit, page);
  };



  const fetchOmniInventoryDump = async () => {

    document.getElementById('app-loader-container').style.display = "block";
    const fetchOmniInventoryDumpViewResponse = await EcommerceApiUtil.getOmniInventoryDump();
    console.log('fetchOmniInventoryDumpViewResponse:', fetchOmniInventoryDumpViewResponse);

    if (fetchOmniInventoryDumpViewResponse.hasError) {
      console.log('Cant fetch Omni Inventory Sync Data -> ', fetchOmniInventoryDumpViewResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(fetchOmniInventoryDumpViewResponse.errorMessage, 3);

    }
    else {
      console.log('res -> ', fetchOmniInventoryDumpViewResponse);
      if (mounted) {     //imp if unmounted
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(fetchOmniInventoryDumpViewResponse.message, 3);
        fetchOmniAlInventorySync();

      }
    }

  }




  const InventorySyncMenu = (
    <Menu>
      <Menu.Item key="0"
        onClick={fetchOmniInventoryDump}
      >
        Inventory Sync
      </Menu.Item>
    </Menu>
  );



  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Inventory Sync</h1>
        <div className="page__header__buttons">
          <Dropdown overlay={InventorySyncMenu} trigger={["click"]}>
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

      <div className="page__content">

        <div className="table">
          <OmniInventorySyncTable
            tableData={omniInventorySyncData}
            pageLimit={paginationLimit}
            paginationData={paginationData}
            tableDataLoading={loading}
            onClickPageChanger={handlePageChange}
          />

        </div>

      </div>

    </div>
  );
};

export default InventorySync;
