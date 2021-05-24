import React, { useState, useEffect } from "react";
import "../style.scss";
import { useHistory } from "react-router-dom";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import * as SuppliersApiUtil from "../../../../utils/api/suppliers-api-utils";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import StockNestedProductsTable from "../../../organism/table/stock/stockNestedProductsTable";
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
  Switch,
  Divider,
  InputNumber,
} from "antd";

const { Option } = Select;

const pageLimit = 20;



const ReturnStock = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [productsTableData, setProductsTableData] = useState([]);
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [suppliers, setSuppliersData] = useState([]);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  //const [suppliersPaginationData, setSuppliersPaginationData] = useState({});
  



  var mounted = true;

  //var registeredProductsLimit = Helpers.registeredProductsPageLimit;
  //var suppliersPageLimit = Helpers.suppliersPageLimit;


  useEffect(() => {
    fetchRegisteredProductsData();
    let pageNumber = 1;
    fetchSuppliersData(pageLimit, pageNumber);
    /*-----setting template data to fields value------*/
    form.setFieldsValue({
      order_reference_name: `Return - ${moment(new Date()).format("yyyy/MM/DD HH:mm:ss")}`,
    });
    /*-----setting template data to fields value------*/

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
      message.error(productsDiscountsViewResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', productsDiscountsViewResponse);

      if (mounted) {     //imp if unmounted
        message.success(productsDiscountsViewResponse.message, 3);
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



  const fetchSuppliersData = async (pageLimit = 10, pageNumber = 1) => {

    const SuppliersViewResponse = await SuppliersApiUtil.viewAllSuppliers();
    console.log("SuppliersViewResponse:", SuppliersViewResponse);

    if (SuppliersViewResponse.hasError) {
      console.log(
        "Cant fetch suppliers -> ",
        SuppliersViewResponse.errorMessage
      );
    } else {
      console.log("res -> ", SuppliersViewResponse);
      if (mounted) {     //imp if unmounted
        setSuppliersData(SuppliersViewResponse.suppliers.data || SuppliersViewResponse.suppliers);
        //setSuppliersPaginationData(SuppliersViewResponse.suppliers.page || {});
      }
    }
  };


  const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
    setProductsTableData(productsData);
    setProductsTotalQuantity(productsTotalQuantity);
  };



  const handleAddProduct = () => {
    var formValues = form.getFieldsValue();

    if (!selectedProductId) {
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

    var returnStockPostData = {};
    var clonedProductsPostData = [];
    //console.log("vvimp", productsTableData);
    productsTableData.forEach((item, index) => {
      clonedProductsPostData.push({ qty: item.qty, selected: item });
    });
    clonedProductsPostData.forEach((item, index) => {
      delete item.selected['qty'];
    });


    returnStockPostData.products = clonedProductsPostData;
    returnStockPostData.date_due = "";
    returnStockPostData.po_name = formValues.order_reference_name;
    returnStockPostData.return_name = returnStockPostData.po_name;
    returnStockPostData.ordered_date = moment(new Date()).format("yyyy/MM/DD HH:mm:ss");  //imp to have in the same format
    returnStockPostData.return_date = returnStockPostData.ordered_date;
    returnStockPostData.supplier_id = formValues.supplier;

    //console.log("vvimp-final", returnStockPostData);

    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    const hide = message.loading('Saving Changes in progress..', 0);
    const res = await StockApiUtil.returnStock(returnStockPostData);
    console.log('ReturnStockResponse:', res);

    if (res.hasError) {
      console.log('Cant Return Stock  -> ', res.errorMessage);
      message.error(res.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setButtonDisabled(false);
      setTimeout(hide, 1500);
    }
    else {
      console.log('res -> ', res);
      message.success(res.message, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(hide, 1000);
      setTimeout(() => {
        history.push({
          pathname: '/stock-control/purchase-orders',
          activeKey: 'purchase-orders'
        });
      }, 2000);
    }

  }


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
      pathname: '/stock-control/purchase-orders',
      activeKey: 'purchase-orders'
    });
  };



  /*const handleSuppliersScroll = async (e) => {
    //console.log("inside-scroll", e);
    var height = e.target.clientHeight;
    //console.log(height);
    //console.log(e.target.clientHeight);
    height = height * 0.5;
    //console.log(e.target.scrollTop);
    //console.log(e.target.scrollHeight);
    const targetHeight = e.target.scrollHeight - e.target.scrollTop;
    const clientHeight = e.target.clientHeight + height;
    //console.log("target-height", targetHeight);

    if (targetHeight < clientHeight && !isBusy) {
      let pN = Math.ceil(suppliers.length / pageLimit) + 1;

      if (pN <= suppliersPaginationData.totalPages) {
        setIsBusy(true);
        setSuppliersScrollLoading(true);
        const suppliersRes = await SuppliersApiUtil.viewSuppliers(pageLimit, pN);
        if (suppliersRes.hasError) {
          console.log("suppliersRes RESPONSE FAILED -> ", suppliersRes.errorMessage);
        } else {
          console.log("res -> ", suppliersRes);
          if (mounted) {     //imp if unmounted
            let suppliersData = suppliersRes.suppliers.data || suppliersRes.suppliers;
            var newData = [...suppliers];
            newData.push(...suppliersData);
            setSuppliersData(newData);
            setIsBusy(false);
            setSuppliersScrollLoading(false);
          }
        }

      } 

    } 

  }*/   





  return (
    <div className="page stock-add">
      <div className="page__header">
        <h1>New Return Stock</h1>
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
                      label="Supplier"
                      name="supplier"
                      rules={[
                        {
                          required: true,
                          message: "Please select supplier",
                        },
                      ]}
                    >

                    <Select placeholder="Select Supplier"
                      showSearch    //vimpp to seach
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                    >
                        {
                          suppliers.map((obj, index) => {
                            return (
                              <Option key={obj.supplier_id} value={obj.supplier_id}>
                                {obj.supplier_name}
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
                {/*<div className="form__section__header">
                  <div className="switch__row">
                    <Switch className="bulk-order-switch"
                      onChange={handleBulkSwitch} />
                    <h2>Bulk Order</h2>
                  </div>
                </div> */}


              </div>
              {/* Form Section */}

              {/* Form Section */}
              <div className="form__section">
                {/*<div className="form__section__header">
                <div className="switch__row">
                  <h2>Order Products</h2>
                </div>
              </div> */}
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
                      <InputNumber />
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
                    tableType="order_return" />
                </div>
                {/* Table */}
                <Divider />


                <div className='form__row--footer'>
                  <Button type='secondary' onClick={handleCancel}>
                    Cancel
                    </Button>
                  <Button
                    type='primary'
                    className='custom-btn custom-btn--primary'
                    htmlType="submit"
                    disabled={buttonDisabled}
                  >
                    Save
                </Button>
                </div>

              </div>
              {/* Form Section */}

            </Form>

          </div>
        </div>}
    </div>
  );
};

export default ReturnStock;
