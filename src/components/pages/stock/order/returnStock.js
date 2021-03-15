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
} from "antd";

const { Option } = Select;



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

  var registeredProductsLimit = Helpers.registeredProductsPageLimit;
  var suppliersPageLimit = Helpers.suppliersPageLimit;



  useEffect(() => {
    fetchRegisteredProductsData();
    fetchSuppliersData();
    /*-----setting template data to fields value------*/
    form.setFieldsValue({
      order_reference_name: `Return - ${moment(new Date()).format("MM/DD/yyyy HH:mm:ss")}`,
    });
    /*-----setting template data to fields value------*/

  }, []);


  const handleSearch = async (value) => {

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
    let productId = value.split('-');
    console.log(option.children);
    setSelectedSearchValue(option.children);
    setSelectedProductId(productId[0]);  //passes productId
  };



  const fetchRegisteredProductsData = async (pageLimit = 20, pageNumber = 1) => {
    const productsDiscountsViewResponse = await ProductsApiUtil.getRegisteredProducts(
      registeredProductsLimit,
      pageNumber
    );
    console.log(' productsDiscountsViewResponse:', productsDiscountsViewResponse);

    if (productsDiscountsViewResponse.hasError) {
      console.log('Cant fetch registered products Data -> ', productsDiscountsViewResponse.errorMessage);
      message.error(productsDiscountsViewResponse.errorMessage, 3);
      setLoading(false);
    }
    else {
      console.log('res -> ', productsDiscountsViewResponse);
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

    }
  }



  const fetchSuppliersData = async (pageLimit = 20, pageNumber = 1) => {

    const SuppliersViewResponse = await SuppliersApiUtil.viewSuppliers(
      suppliersPageLimit,
      pageNumber
    );
    console.log("SuppliersViewResponse:", SuppliersViewResponse);

    if (SuppliersViewResponse.hasError) {
      console.log(
        "Cant fetch suppliers -> ",
        SuppliersViewResponse.errorMessage
      );
    } else {
      console.log("res -> ", SuppliersViewResponse);
      setSuppliersData(SuppliersViewResponse.suppliers.data || SuppliersViewResponse.suppliers);
    }
  };


  const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
    setProductsTableData(productsData);
    setProductsTotalQuantity(productsTotalQuantity);
  };



  const handleAddProduct = () => {
    console.log("inside");
    var formValues = form.getFieldsValue();
    console.log("changed", formValues);

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
          p.qty += parseFloat(formValues.product_qty);
        }
      }); //end of for loop

      if (productExistsCheck) {
        calculateProductsTotalQuantity(productsTableData);
        setProductsTableData(productsTableData);
      }
      if (!productExistsCheck) {
        selectedItem.qty = parseFloat(formValues.product_qty);
        newData.push(selectedItem);
        console.log("imp1-table", newData);
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
    console.log("vvimp", productsTableData);
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
    returnStockPostData.ordered_date = moment(new Date()).format("MM/DD/yyyy HH:mm:ss");
    returnStockPostData.return_date = returnStockPostData.ordered_date;
    returnStockPostData.supplier_id = formValues.supplier;

    console.log("vvimp-final", returnStockPostData);

    const hide = message.loading('Saving Changes in progress..', 0);
    const res = await StockApiUtil.returnStock(returnStockPostData);
    console.log('ReturnStockResponse:', res);

    if (res.hasError) {
      console.log('Cant Return Stock  -> ', res.errorMessage);
      message.error(res.errorMessage, 3);
      setTimeout(hide, 1500);
    }
    else {
      console.log('res -> ', res);
      message.success(res.message, 3);
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



  return (
    <div className="page stock-add">
      <div className="page__header">
        <h1>New Return Stock</h1>
      </div>
      <div style={{ textAlign: "center" }}>
        {loading && <Spin size="large" tip="Loading..." />}
      </div>


      {!loading &&
        <div className="page__content">
          <div className="page__form">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              initialValues={{
                remember: true,
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
                      <Select>
                        {
                          suppliers.map((obj, index) => {
                            return (
                              <option key={obj.supplier_id} value={obj.supplier_id}>
                                {obj.supplier_name}
                              </option>
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
                      name="search_product"
                    >
                      <AutoComplete style={{ width: "100%" }}
                        dropdownMatchSelectWidth={500}
                        value={selectedSearchValue}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        placeholder="search for product">
                        {productsSearchResult && productsSearchResult.map((item) => (
                          <Option key={item.product_id} value={item.product_id + `-${item.searchName}`}>
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
                      <Input defaultValue={1} />
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
