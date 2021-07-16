import React, { useState, useEffect } from "react";
import { Button, Select, Input, message, Menu, Dropdown, } from "antd";
import { ProfileOutlined, DownOutlined, DownloadOutlined } from "@ant-design/icons";
import EdiTableProducts from "../../organism/table/productsNestedTable/productsTable";
import { useHistory } from "react-router-dom";
import * as ProductsApiUtil from '../../../utils/api/products-api-utils';
import * as SetupApiUtil from '../../../utils/api/setup-api-utils';
import * as SalesApiUtil from '../../../utils/api/sales-api-utils';
import Constants from '../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";



const Products = () => {
  const [paginationLimit, setPaginationLimit] = useState(20);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [userOutletData, setUserOutletData] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);



  let mounted = true;

  const { Option } = Select;
  const { Search } = Input;
  const history = useHistory();



  const onSearch = async (value) => {
    let searchValue = value;
    if (searchValue === "") {
      setSearchedData(null);
      setLoading(true);
      fetchProductsData();   // imp
      return;
    }

    setSearchedData(searchValue);
    setLoading(true);
    fetchSearchProducts(paginationLimit, 1, searchValue);
  }


  const fetchSearchProducts = async (pageLimit = 20, pageNumber = 1, searchValue) => {
    document.getElementById('app-loader-container').style.display = "block";
    const productsSearchResponse = await ProductsApiUtil.searchProducts(
      pageLimit,
      pageNumber,
      searchValue
    );
    console.log('productsSearchResponse:', productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.warning(productsSearchResponse.errorMessage, 2);
    }
    else {
      console.log('res -> ', productsSearchResponse);
      setData(productsSearchResponse.products.data);
      setPaginationData(productsSearchResponse.products.page);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
      //message.success(productsSearchResponse.message, 2);
    }

  }



  const fetchProductsData = async (pageLimit = 20, pageNumber = 1) => {

    document.getElementById('app-loader-container').style.display = "block";
    const productsViewResponse = await ProductsApiUtil.viewProducts(pageLimit, pageNumber);
    console.log('productsViewResponse:', productsViewResponse);

    if (productsViewResponse.hasError) {
      console.log('Cant fetch products -> ', productsViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', productsViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(productsViewResponse.message, 3);
        setData(productsViewResponse.products.data);
        setPaginationData(productsViewResponse.products.page);
        setLoading(false);
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
      setUserOutletData(selectedStore);
      document.getElementById('app-loader-container').style.display = "none";

    }
  }



  useEffect(() => {
    fetchProductsData();

    /*--------------set user local data-------------------------------*/
    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        getUserStoreData(readFromLocalStorage.auth.current_store);
      }
    }
    /*--------------set user local data-------------------------------*/

    return () => {
      mounted = false;
    }

  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    //setCurrentPage(1);
    setLoading(true);
    if (searchedData) {
      if (currentPageSearched > Math.ceil(paginationData.totalElements / value)) {
        fetchSearchProducts(value, 1, searchedData);
      }
      else {
        fetchSearchProducts(value, currentPageSearched, searchedData);
      }
    }  /*------end of outer if---------*/
    else {
      if (currentPage > Math.ceil(paginationData.totalElements / value)) {
        fetchProductsData(value, 1);
      }
      else {
        fetchProductsData(value, currentPage);
      }
    }  /*------end of outer else---------*/

  }


  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchProductsData(paginationLimit, currentPg);
  }


  function handleSearchedDataPageChange(currentPg) {
    console.log("sechedpage");
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchProducts(paginationLimit, currentPg, searchedData);
  }


  const ExportToCsv = async (e) => {

    if (data.length > 0) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);}
      //document.getElementById('app-loader-container').style.display = "block";
      const getStoreResponse = await SalesApiUtil.getStoreId();
      if (getStoreResponse.hasError) {
        const errorMessage = getStoreResponse.errorMessage;
        console.log('Cant get Store Id -> ', errorMessage);
        setButtonDisabled(false);
        //document.getElementById('app-loader-container').style.display = "none";
        message.error(errorMessage, 3);
      } else {
        console.log("Success:", getStoreResponse.message);
        downloadProductsCSVData(getStoreResponse || null);
      }
    }
    else { message.warning("Products Data Not Found", 3) } 

  }


  const downloadProductsCSVData = async (fetchedStore) => {
    //console.log("fetchedStore", fetchedStore);
    let productsImportParams = {
      "store_id": fetchedStore.store_id,
    };

    const productsExportResponse = await ProductsApiUtil.exportProductsData(
      productsImportParams
    );
    
    console.log("Products Export response:", productsExportResponse);

    if (productsExportResponse.hasError) {
      console.log(
        "Cant Export Products Data-> ",
        productsExportResponse.errorMessage
      );
      setButtonDisabled(false);
      //document.getElementById('app-loader-container').style.display = "none";
      message.error(productsExportResponse.errorMessage, 3);

    } else {
      //console.log("res -> ", stockAdjustmentsExportResponse.data);
      /*---------------csv download--------------------------------*/
      // CSV FILE
      let csvFile = new Blob([productsExportResponse.data], { type: "text/csv" });
      let url = window.URL.createObjectURL(csvFile);
      let a = document.createElement('a');
      a.href = url;
      a.download = "products_" + new Date().toUTCString() + ".csv";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove();  //afterwards we remove the element again
      /*---------------csv download--------------------------------*/
      if (mounted) {               //imp if not mounted then change state
        setButtonDisabled(false);
      }
      //document.getElementById('app-loader-container').style.display = "none";
      //message.success(productsExportResponse.message, 3);

    }

  }
 



  const PrductsMenu = (
    <Menu>
      <Menu.Item key='0' onClick={() => history.push({ pathname: "products/add" })}>
        <a>New Product</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='1' onClick={() => history.push({ pathname: "products/upload" })}>
        Upload Bulk
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='2' onClick={() => history.push({ pathname: "products/lookup" })}>
        Lookup
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='3' onClick={() => history.push({ pathname: "products/discount" })}>
        Discount
      </Menu.Item>
    </Menu>
  );



  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Products</h1>

        <div className='page__header__buttons'>

          <Button type='primary'
            className='custom-btn custom-btn--primary'
            icon={<DownloadOutlined />}
            onClick={ExportToCsv}
            disabled={buttonDisabled}
          >
            Export CSV
          </Button>

          <Dropdown overlay={PrductsMenu} placement="bottomCenter"
            trigger={["click"]}>
            <Button
              type='Default'
              icon={<DownOutlined />}
              onClick={(e) => e.preventDefault()}
            >
              More <ProfileOutlined />
            </Button>
          </Dropdown>
        </div>

      </div>
      <div className='page__content'>
        <div className='action-row'>
          <div className='action-row__element'>
            Show
            <Select
              defaultValue='20'
              style={{ width: 120, margin: "0 5px" }}
              onChange={handleChange}
            >
              <Option value='10'>10</Option>
              <Option value='20'>20</Option>
              <Option value='50'>50</Option>
              <Option value='100'>100</Option>
            </Select>
            entries
          </div>

          <div className='action-row__element'>
            <Search
              placeholder='search product'
              allowClear
              enterButton='Search'
              size='large'
              onSearch={onSearch}
            />
          </div>
        </div>

        {searchedData &&
          <div className='table'>
            <EdiTableProducts pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
              paginationData={paginationData}
              onClickPageChanger={handleSearchedDataPageChange}
              selectedOutletData={userOutletData}
            />
          </div>}

        {!searchedData &&
          <div className='table'>
            <EdiTableProducts pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
              paginationData={paginationData}
              onClickPageChanger={handlePageChange}
              selectedOutletData={userOutletData}
            />
          </div>}


      </div>
    </div>
  );
};

export default Products;
