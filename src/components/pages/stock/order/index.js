import React, { useState, useEffect } from "react";
import "../style.scss";
import { useHistory } from "react-router-dom";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import * as SuppliersApiUtil from "../../../../utils/api/suppliers-api-utils";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import StockNestedProductsTable from "../../../organism/table/stock/stockNestedProductsTable";
import Constants from '../../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import moment from 'moment';


import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Spin,
  AutoComplete,
  Upload,
  message,
  Row,
  Col,
  Space,
  Switch,
  Divider,
} from "antd";

import {
  UploadOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const pageLimit = 20;



const PurchaseOrder = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [productsTableData, setProductsTableData] = useState([]);
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [suppliers, setSuppliersData] = useState([]);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [orderDueDate, setOrderDueDate] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userLocalStorageData, setUserLocalStorageData] = useState(null);
  //const [suppliersPaginationData, setSuppliersPaginationData] = useState({});
  //const [isBusy, setIsBusy] = useState(false);
  //const [suppliersScrollLoading, setSuppliersScrollLoading] = useState(false);
  

  var mounted = true;



  useEffect(() => {
    fetchRegisteredProductsData();
    let pageNumber = 1;
    fetchSuppliersData(pageLimit, pageNumber);
    /*-----setting template data to fields value------*/
    form.setFieldsValue({
      order_reference_name: `Order - ${moment(new Date()).format("yyyy/MM/DD HH:mm:ss")}`,
    });
    /*-----setting template data to fields value------*/

    /*--------------set user local data-------------------------------*/
    var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    setUserLocalStorageData(readFromLocalStorage);
    /*--------------set user local data-------------------------------*/

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
        let searchValue = entry.searchName;
        searchValue = searchValue.toLowerCase();
        let productSku = entry.product_sku;
        productSku = productSku.toLowerCase();

        return searchValue.includes(currValue) || productSku.includes(currValue);
      });
      setProductsSearchResult(filteredData);
    }

  };


  const handleSelect = (value, option) => {
    //let productId = value.split('-');
    //console.log(value);
    //console.log(option.children);
    setSelectedSearchValue(option.children);     //searchName
    setSelectedProductId(value);                 //passes productId
  };



  const SelectProductOnEnter = (event) => {
    //console.log(event);
    if (event.key === "Enter") {
      //console.log(" enter");
      //console.log(selectedSearchValue);   //imp new searched value
      let foundObj = productsSearchResult.find(obj => {
        return obj.product_sku === selectedSearchValue || obj.product_name === selectedSearchValue;
      });
      if (foundObj) {
        //console.log("found");
        //console.log(foundObj);
        handleAddProductData(foundObj.product_id);          //imp new one
        setSelectedSearchValue("");                         //imp new one
        setProductsSearchResult([]);                        //imp new one
      }
      else {
        //console.log("not found");
      }

    } else {
      //console.log("not enter");
    }

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



  const fetchSuppliersData = async (pageLimit = 10, pageNumber = 1) => {

    //const SuppliersViewResponse = await SuppliersApiUtil.viewSuppliers(pageLimit, pageNumber);
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


  const handleUpload = () => {
    console.log(fileList[0]);   //imp
    var file = fileList[0];


    if (file && fileExtention(file.name) === 'csv') {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function (evt) {
        // code to convert file data and render in json format
        var json = JSON.parse(Helpers.CSV2JSON(evt.target.result));
        console.log(json);
        //jsonOutput = JSON.parse((jsonOutput));
        /*-------------------------------*/
        var bulkProducts = [];
        json.forEach((v, k) => {
          registereProductsData.forEach((v2, k2) => {
            if (v.SKU == v2.product_sku) {
              let selectedItemCopy = JSON.parse(JSON.stringify(v2));
              selectedItemCopy.qty = parseFloat(v.Quantity);
              bulkProducts.push(selectedItemCopy);
              return 0;
            }
          });
        });  // end of for loop

        //setProductsTableData(bulkProducts);   //imp 
        handleCombineProductsTableData(bulkProducts, [...productsTableData]);
        //message.success("Products Imported", 3);
        /*-------------------------------*/

      }
      reader.onerror = function (evt) {
        message.error('error reading file');
      }
    }
    else {
      message.error('Not a csv file');
    }

  };



  const imageUploadProps = {
    beforeUpload: file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (isJpgOrPng) {
        message.error('You cant  upload JPG/PNG file!');
      }
      else { setFileList([file]); }

      return false;
    },
    fileList,
  };

  function fileExtention(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }


  const onRemoveImage = (file) => {
    setFileList([]);
  };

  const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
    setProductsTableData(productsData);
    setProductsTotalQuantity(productsTotalQuantity);
  };


  
  const handleAddProduct = () => {
    handleAddProductData(selectedProductId);
    setSelectedSearchValue("");
    setProductsSearchResult([]); 
  };



  const handleAddProductData = (selectedProdId) => {
    //console.log(selectedProdId);
    var formValues = form.getFieldsValue();
    if(!selectedProdId){
      message.warning("please select product!");
      return;
    }
    var productExistsCheck = false;
    var newData = [...productsTableData];
    //productsTableData
    const index = registereProductsData.findIndex(
      item => selectedProdId == item.product_id);

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



  const handleCombineProductsTableData = (bulkProducts, tableProducts) => {
    if (bulkProducts.length > tableProducts.length) {
      bulkProducts.forEach((v, k) => {
        tableProducts.forEach((v2, k2) => {
          //console.log(v);
          if (v.product_sku == v2.product_sku) {
            v.qty = v.qty + parseFloat(v2.qty);
            return 0;
          }
        });
      });  // end of for loop

      calculateProductsTotalQuantity(bulkProducts);
      setProductsTableData(bulkProducts);
    }   // first if

    if (tableProducts.length >= bulkProducts.length) {
      tableProducts.forEach((v, k) => {
        bulkProducts.forEach((v2, k2) => {
          // console.log(v);
          if (v.product_sku == v2.product_sku) {
            v.qty = v.qty + parseFloat(v2.qty);
            //bulkProducts.push(selectedItemCopy);
            return 0;
          }
        });
      });  // end of for loop

      calculateProductsTotalQuantity(tableProducts);
      setProductsTableData(tableProducts);
    }   // end of second if

  };


  const handleSaveChanges = async (e) => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);

    if (productsTableData.length === 0) {
      message.error("No Products Added", 4);
      return;
    }

    var addPurchaseOrderPostData = {};
    //var clonedProducts = JSON.parse(JSON.stringify(productsTableData));
    var clonedProductsPostData = [];
    //console.log("vvimp", productsTableData);
    productsTableData.forEach((item, index) => {
      clonedProductsPostData.push({ qty: item.qty, selected: item });
    });
    clonedProductsPostData.forEach((item, index) => {
      delete item.selected['qty'];
    });


    addPurchaseOrderPostData.products = clonedProductsPostData;
    addPurchaseOrderPostData.date_due = orderDueDate;
    addPurchaseOrderPostData.po_name = formValues.order_reference_name;
    addPurchaseOrderPostData.ordered_date = moment(new Date()).format("yyyy/MM/DD HH:mm:ss");
    addPurchaseOrderPostData.supplier_id = formValues.supplier;

    //console.log("vvimp-final", clonedProductsPostData);

    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    const res = await StockApiUtil.addPurchaseOrder(addPurchaseOrderPostData);
    console.log('AddPoResponse:', res);

    if (res.hasError) {
      console.log('Cant Add Purchase Order -> ', res.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(res.errorMessage, 2);
      setButtonDisabled(false);
    }
    else {
      console.log('res -> ', res);
      document.getElementById('app-loader-container').style.display = "none";
      //message.success(res.message, 1);
      setTimeout(() => {
        history.push({
          pathname: '/stock-control/purchase-orders',
          activeKey: 'purchase-orders'
        });
      }, 1200);
    }

  }



  const handleDownloadPoForm = async () => {
    document.getElementById('app-loader-container').style.display = "block";
    const downloadPoResponse = await StockApiUtil.downloadPoForm();
    console.log("downloadPoResponse:", downloadPoResponse);

    if (downloadPoResponse.hasError) {
      console.log(
        "Cant Download PO Form -> ",
        downloadPoResponse.errorMessage
      );
      document.getElementById('app-loader-container').style.display = "none";


    } else {
      console.log("res -> ", downloadPoResponse);
      document.getElementById('app-loader-container').style.display = "none";
      var csv = "SKU,Quantity\n";
      var arr = downloadPoResponse.product;
      arr.forEach(function (row) {
        csv += row.product_sku + ",0\n";
      });

      //var parent = document.getElementById("download_csv");
      var hiddenElement = document.createElement("a");
      //parent.appendChild(hiddenElement);
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      hiddenElement.target = "_blank";
      hiddenElement.download = new Date().toUTCString() + "-Product-SKU.csv";
      hiddenElement.click();
      //parent.removeChild(hiddenElement); 
    }


  };


  function onDatePickerChange(date, dateString) {
    setOrderDueDate(dateString);
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleBulkSwitch = (checked) => {
    setShowBulkUpload(checked);
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

  }  */


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



  return (
    <div className="page stock-add">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />New Purchase Order</h1>
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
                        //onPopupScroll={handleSuppliersScroll}
                        //loading={suppliersScrollLoading}
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

                {/* Row */}
                <div className="form__row">
                  <div className="form__col">
                    <Form.Item
                      label="Delivery due"
                      name="delivery_due_date"
                      rules={[
                        {
                          required: true,
                          message: "Please select Due date",
                        },
                      ]}
                    >
                      <DatePicker onChange={onDatePickerChange} />
                    </Form.Item>
                  </div>

                  <div className="form__col"></div>
                </div>
                {/* Row */}
              </div>
              {/* Form Section */}

              {/* Form Section */}
              <div className="form__section">
                <div className="form__section__header">
                  <div className="switch__row">
                    <Switch className="bulk-order-switch"
                      onChange={handleBulkSwitch} />
                    <h2>Bulk Order</h2>
                  </div>
                </div>


                {showBulkUpload &&
                  <div className="form__row">
                    <div className="form__col">
                      <Form.Item>
                        <Upload {...imageUploadProps} onRemove={onRemoveImage}>
                          <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                      </Form.Item>
                    </div>

                    <div className="form__col">
                      <Form.Item>
                        <Button type="primary" icon={<DownloadOutlined />}
                          style={{ width: "100%" }}
                          id="download_csv"
                          onClick={handleDownloadPoForm}>
                          Download sample File
                    </Button>
                      </Form.Item>
                    </div>
                  </div>}

                {showBulkUpload &&
                  <div className="form__row">
                    <div className="form__col">
                      <Form.Item>
                        <Button type="default" onClick={handleUpload}
                          style={{ width: "100%" }}>
                          Done
                    </Button>
                      </Form.Item>
                    </div>
                  </div>}

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
                  Order products
                <label className="label-stock-count">
                    {productsTotalQuantity}
                  </label>
                </h4>


                <Row gutter={16, 16} >
                  <Col xs={24} sm={24} md={12} className="stock-item-content">
                    <Form.Item
                      label="Search Product"
                      //name="search_product"
                    >
                      <AutoComplete style={{ width: "100%" }}
                        dropdownMatchSelectWidth={500}
                        className="select-product-drop-down-menu"
                        value={selectedSearchValue}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        placeholder="search for product"
                        onKeyDown={SelectProductOnEnter}
                      >

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
                      <Input onChange={onQuantityInputChange}  />
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
                    tableType="order_stock"
                    currency={userLocalStorageData.currency.symbol}
                  />
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

export default PurchaseOrder;
