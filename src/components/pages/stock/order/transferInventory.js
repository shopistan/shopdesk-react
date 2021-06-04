import React, { useState, useEffect } from "react";
import "../style.scss";
import { useHistory } from "react-router-dom";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import StockNestedProductsTable from "../../../organism/table/stock/stockNestedProductsTable";
import Constants from '../../../../utils/constants/constants';
import { 
    getDataFromLocalStorage,
    checkUserAuthFromLocalStorage, 
  } from "../../../../utils/local-storage/local-store-utils";
import moment from 'moment';


import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  AutoComplete,
  message,
  Row,
  Col,
  Divider,
  InputNumber,
} from "antd";

import {
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Option } = Select;



const TransferInventory = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [productsTableData, setProductsTableData] = useState([]);
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [outlets, setOutletsData] = useState([]);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [currentStoreId, setCurrentStoreId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userLocalStorageData, setUserLocalStorageData] = useState(null);



  var mounted = true;


  useEffect(() => {
    fetchRegisteredProductsData();
    //fetchOutletsData();
    /*-----setting template data to fields value------*/
    form.setFieldsValue({
      order_reference_name: `Transfer - ${moment(new Date()).format("yyyy/MM/DD HH:mm:ss")}`,
    });
    /*-----setting template data to fields value------*/

    /*-----------set user store id-------------*/
    var readFromLocalStorage = getDataFromLocalStorage(
        Constants.USER_DETAILS_KEY
      );
      readFromLocalStorage = readFromLocalStorage.data
        ? readFromLocalStorage.data
        : null;
      if (readFromLocalStorage) {

        setUserLocalStorageData(readFromLocalStorage);

        if (
          checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
        ) {
          setCurrentStoreId(readFromLocalStorage.auth.current_store);
          fetchOutletsData(readFromLocalStorage.auth.current_store);  //imp to call here
        }
      }
      /*-----------set user store id-------------*/

      return () => {
        mounted = false;
      }

  }, []);


  const handleSearch = (value) => {
    setSelectedSearchValue(value);

    var currValue = value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setProductsSearchResult([]);
    }
    else {
      const filteredData = registereProductsData.filter((entry) => {
        var searchValue = entry.searchName;
        searchValue = searchValue.toLowerCase();

        return searchValue.includes(currValue);
      });
      setProductsSearchResult(filteredData);
    }

  };


  const handleSelect = (value, option) => {
    //console.log(option.children);
    setSelectedSearchValue(option.children);
    setSelectedProductId(value);  //passes productId
  };



  const fetchRegisteredProductsData = async () => {
    document.getElementById('app-loader-container').style.display = "block";
    const productsDiscountsViewResponse = await ProductsApiUtil.getFullRegisteredProducts();
    console.log(' productsDiscountsViewResponse:', productsDiscountsViewResponse);

    if (productsDiscountsViewResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', productsDiscountsViewResponse.errorMessage);
      message.warning(productsDiscountsViewResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', productsDiscountsViewResponse);

      if (mounted) {     //imp if unmounted
        //message.success(productsDiscountsViewResponse.message, 3);
        /*-------for filtering products--------*/
        var products = productsDiscountsViewResponse.products.data
          || productsDiscountsViewResponse.products;

        for (let i in products) {
          var searchName = products[i].product_name;
          if (Helpers.var_check(products[i].product_variant1_value)) {
            searchName += " / " + products[i].product_variant1_value;
          }
          if (Helpers.var_check(products[i].product_variant2_value)) {
            searchName += " / " + products[i].product_variant2_value;
          }
          products[i].searchName = searchName;
          //products[i].qty = 0;   //imp but not set here ,set at addorder
        }

        setRegistereProductsData(products);

        /*-------for filtering products--------*/
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }

  const fetchOutletsData = async (activeStoreId) => {
    const outletsViewResponse = await SetupApiUtil.viewAllOutlets();
    console.log('outletsViewResponse:', outletsViewResponse);

    if (outletsViewResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', outletsViewResponse.errorMessage);
    }
    else {
      console.log('res -> ', outletsViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(outletsViewResponse.message, 3);
        let outletsData = outletsViewResponse.outlets.data || outletsViewResponse.outlets;
        const filteredOutletsData = outletsData.filter((outlet) => {
          return outlet.store_id !== activeStoreId;
        });
        setOutletsData(filteredOutletsData);
      }
    }
  }


  const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
    setProductsTableData(productsData);
    setProductsTotalQuantity(productsTotalQuantity);
  };



  const handleAddProduct = () => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);
    if(!selectedProductId){
      message.warning("please select product!");
      return;
    }

    var productExistsCheck = false;
    var newData = [...productsTableData];
    //productsTableData
    const index = registereProductsData.findIndex(
      item => selectedProductId == item.product_id);

    if (index > -1) {
      //deep copy
      const selectedItem = JSON.parse(JSON.stringify(registereProductsData[index]));
      productsTableData.forEach((p) => {
        if (p.product_id === selectedItem.product_id) {
          productExistsCheck = true;
          let inputQtyValue = Helpers.var_check(formValues.product_qty) ? formValues.product_qty : 1;
          p.qty += parseFloat(inputQtyValue);
        }
      }); //end of for loop

      if (productExistsCheck) {
        calculateProductsTotalQuantity(productsTableData);
        setProductsTableData(productsTableData);
      }
      if (!productExistsCheck) {
        let inputQtyValue = Helpers.var_check(formValues.product_qty) ? formValues.product_qty : 1;
        selectedItem.qty = parseFloat(inputQtyValue);
        newData.push(selectedItem);
        //console.log("imp1-table", newData);
        calculateProductsTotalQuantity(newData);
        setProductsTableData(newData);
      }

    } //end of top first if
  };


  const calculateProductsTotalQuantity = (data) => {
    var productsTotalQuantity = 0;
    const newData = [...data];
    newData.forEach(item => {
      productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
    });

    setProductsTotalQuantity(productsTotalQuantity);
  }



  const handleSaveChanges = async () => {
    var formValues = form.getFieldsValue();

    if (productsTableData.length === 0) {
      message.error("No Products Added", 4);
      return;
    }

    var transferInventoryPostData = {};
    var clonedProductsPostData = [];
    //console.log("vvimp", productsTableData);
    productsTableData.forEach((item, index) => {
      clonedProductsPostData.push({ qty: item.qty, selected: item });
    });
    clonedProductsPostData.forEach((item, index) => {
      delete item.selected['qty'];
    });


    transferInventoryPostData.products = clonedProductsPostData;
    transferInventoryPostData.date_due = "";
    transferInventoryPostData.supplier_id = "";
    transferInventoryPostData.po_name = formValues.order_reference_name;
    transferInventoryPostData.transfer_name = transferInventoryPostData.po_name;
    transferInventoryPostData.ordered_date = moment(new Date()).format("yyyy/MM/DD HH:mm:ss");
    transferInventoryPostData.transfer_date = transferInventoryPostData.ordered_date;
    transferInventoryPostData.destination_store_id = formValues.destination_outlet;
    transferInventoryPostData.source_store_id = currentStoreId;

    //console.log("vvimp-final", transferInventoryPostData);

    if (buttonDisabled === false) {
      setButtonDisabled(true);}
     
    document.getElementById('app-loader-container').style.display = "block";
    const res = await StockApiUtil.transferInventory(transferInventoryPostData);
    console.log('TransferOutResponse:', res);

    if (res.hasError) {
      console.log('Cant Transfer Inventory Stock  -> ', res.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(res.errorMessage, 3);
      setButtonDisabled(false);
    }
    else {
      console.log('res -> ', res);
      document.getElementById('app-loader-container').style.display = "none";
      message.success(res.message, 3);
      setTimeout(() => {
        history.push({
          pathname: '/stock-control/inventory-transfers',
          activeKey: 'inventory-transfers'
        });
      }, 1000);
    }

  }



  const onQuantityInputChange = (e) => {
    let orderQty = e.target.value;
    const re = /^[0-9\b]+$/;
    //console.log(re.test(e.target.value));
    if (!orderQty === '' || !re.test(orderQty)) {  //if contains alphabets in string
      form.setFieldsValue({
        product_qty: orderQty.replace(/[^\d.]/g, '')
      });

    }

  }



  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
      pathname: '/stock-control/inventory-transfers',
      activeKey: 'inventory-transfers'
    });
  };



  return (
    <div className="page stock-add">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Transfer Out</h1>
      </div>


      {!loading &&
        <div className="page__content">
          <div className="page__form">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              initialValues={{
                product_qty: 1,
              }}
              onFinish={handleSaveChanges}
              onFinishFailed={onFinishFailed}
            >
              {/* Form Section */}
              <div className="form__section">
                {/*<div className="form__section__header">
                <h2>Details</h2>
              </div> */}
                <h4 className="stock-receive-details-heading">Details</h4>

                {/* Row */}
                <div className="form__row">
                <div className="form__col">
                    <Form.Item
                      label="Name / reference"
                      name="order_reference_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Name / reference",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form__col">
                    <Form.Item
                      label="Destination outlet"
                      name="destination_outlet"
                      rules={[
                        {
                          required: true,
                          message: "Please select outlet",
                        },
                      ]}
                    >
                      <Select placeholder="Please Select Outlet">
                        {
                          outlets.map((obj, index) => {
                            return (
                              <Option key={obj.store_id} value={obj.store_id}>
                                {obj.store_name}
                              </Option>
                            )
                          })
                        }
                      </Select>
                    </Form.Item>
                  </div>

                </div>
                {/* Row */}

              </div>
              {/* Form Section */}

              {/* Form Section */}
              <div className="form__section">
                <h4 className="stock-receive-products-heading stock-receive-row-heading">
                  Products
                <label className="label-stock-count">
                    {productsTotalQuantity}
                  </label>
                </h4>


                <Row gutter={16, 16} >
                  <Col xs={24} sm={24} md={12} className="stock-item-content">
                    <Form.Item
                      label="Search Product"
                    >
                      <AutoComplete style={{ width: "100%" }}
                        dropdownMatchSelectWidth={500}
                        value={selectedSearchValue}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        placeholder="search for product">
                          
                        {productsSearchResult && productsSearchResult.map((item) => (
                          <Option key={item.product_id} value={item.product_id}>
                            {item.searchName}
                          </Option>
                        ))}
                      </AutoComplete>

                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={6} className="stock-item-content">
                    <Form.Item
                      label="QTY"
                      name="product_qty"
                    >
                      <Input  onChange={onQuantityInputChange} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={6} className="stock-item-content">
                    <Button type='default' className="stock-oder-add-btn"
                      onClick={handleAddProduct} > Add
                  </Button>
                  </Col>
                </Row>
                <Divider />

                {/* Table */}
                <div className='table'>
                  <StockNestedProductsTable
                    tableData={productsTableData}
                    tableDataLoading={loading}
                    onChangeProductsData={handleChangeProductsData}
                    tableType="order_transfer" 
                    currency={userLocalStorageData.currency.symbol}
                    
                  />
                </div>
                {/* Table */}
                <Divider />


                <div className='form__row--footer'>
                  <Button type='secondary' onClick={handleCancel}>
                    Cancel</Button>
                  <Button
                    type='primary'
                    className='custom-btn custom-btn--primary'
                    htmlType="submit"
                    disabled={buttonDisabled}
                  >
                    Save</Button>
                </div>

              </div>
              {/* Form Section */}
            
            </Form>

          </div>
        </div>}
    </div>
  );
};

export default TransferInventory;
