import React, { useState, useEffect } from "react";
import "./style.scss";
import moment from "moment";
import $ from "jquery";

import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  AutoComplete,
  message,
  Divider,
  Spin,
  InputNumber,
  Collapse,
} from "antd";

import {
  EditOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  getSellInvoiceDataFromLocalStorage,
  saveDataIntoLocalStorage,
  clearDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import { useHistory } from "react-router-dom";
import Constants from "../../../../utils/constants/constants";
import UrlConstants from "../../../../utils/constants/url-configs";
import * as ProductsApiUtil from "../../../../utils/api/products-api-utils";
import * as CustomersApiUtil from "../../../../utils/api/customer-api-utils";
import * as CouriersApiUtil from "../../../../utils/api/couriers-api-utils";
import * as SalesApiUtil from "../../../../utils/api/sales-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import SellNestedProductsTable from "../../../organism/table/sell/sellNestedProductsTable";
import PrintSalesInvoiceTable from "./sellInvoice";

function Sell() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [costForm] = Form.useForm();
  const [saleInvoiceData, setSaleInvoiceData] = useState(null);
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedCustomerValue, setSelectedCustomerValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productsTableData, setProductsTableData] = useState([]);
  const [registereProductsData, setRegistereProductsData] = useState([]);
  const [couriersData, setCouriersData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [localStorageData, setLocalStorageData] = useState("");
  const [isMopModalVisible, setIsMopModalVisible] = useState(false);
  const [selectedCutomer, setSelectedCutomer] = useState("");
  const [productsTotalAmount, setProductsTotalAmount] = useState(0);
  const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
  const [syncStatus, setSyncStatus] = useState(false);

  var clearSync = false;

  const { Search } = Input;
  const { Option } = Select;

  var mounted = true;


  useEffect(() => {
    if (history.location.selected_invoice_data !== undefined) {
      var selectedViewedInvoice = history.location.selected_invoice_data;
      console.log("invoice-imp", selectedViewedInvoice );
      var tmpInvoice = createNewInvoice();
      var rt = false;
      if (selectedViewedInvoice.status_invoice == 0) {
        rt = true;
      }
      tmpInvoice.products = selectedViewedInvoice.invoices;
      tmpInvoice.return = rt;
      if (selectedViewedInvoice.hasCustomer == true) {
        tmpInvoice.customer = selectedViewedInvoice.customer;
        tmpInvoice.hasCustomer = true;
      }
      saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, tmpInvoice);
      //console.log(tmpInvoice);
    }

    fetchRegisteredProductsData();
    fetchCouriersData();
    startInvoice();

    return () => {
      console.log("unmount");
      clearSync = true;
      mounted = false;
    }

  }, []);



  const fetchCouriersData = async () => {
    const couriersViewResponse = await CouriersApiUtil.viewAllCouriers();
    console.log("couriersViewResponse:", couriersViewResponse);

    if (couriersViewResponse.hasError) {
      console.log("Cant fetch couriers -> ", couriersViewResponse.errorMessage);
    } else {
      console.log("res -> ", couriersViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(couriersViewResponse.message, 3);
        setCouriersData(
          couriersViewResponse.courier.data || couriersViewResponse.courier
        );
      }
    }
  };

  const fetchRegisteredProductsData = async () => {
    document.getElementById('app-loader-container').style.display = "block";
    const productsDiscountsViewResponse = await ProductsApiUtil.getFullRegisteredProducts();
    console.log(
      " productsDiscountsViewResponse:",
      productsDiscountsViewResponse
    );

    if (productsDiscountsViewResponse.hasError) {
      console.log(
        "Cant fetch registered products Data -> ",
        productsDiscountsViewResponse.errorMessage
      );
      message.warning(productsDiscountsViewResponse.errorMessage, 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", productsDiscountsViewResponse);

      if (mounted) {     //imp if unmounted
        //message.success(productsDiscountsViewResponse.message, 3);
        /*-------for filtering products--------*/
        var products =
          productsDiscountsViewResponse.products.data ||
          productsDiscountsViewResponse.products;

        products.forEach((e) => {
          e.original_sale_price = e.product_sale_price;
          e.product_sale_price = parseFloat(e.discounted_price).toFixed(2);
        });

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
          products[i].original_tax_value = products[i].tax_value;
        }

        setRegistereProductsData(products);

        /*-------for filtering products--------*/
        //setRegistereProductsData(productsDiscountsViewResponse.products);

        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";

      }

    }
  };

  const handleCustomerSearch = async (searchValue) => {
    const customersSearchResponse = await CustomersApiUtil.searchCustomer(
      searchValue
    );
    console.log("customersSearchResponse:", customersSearchResponse);

    if (customersSearchResponse.hasError) {
      console.log(
        "Cant search Customer -> ",
        customersSearchResponse.errorMessage
      );
    } else {
      console.log("res -> ", customersSearchResponse);
      //message.success(customersSearchResponse.message, 3);
      setCustomersData(
        customersSearchResponse.customers.data ||
          customersSearchResponse.customers
      );
    }
  };

  const handleSearch = (value) => {
    setSelectedValue(value);

    var currValue = value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setProductsSearchResult([]);
    } else {
      const filteredData = registereProductsData.filter((entry) => {
        var searchValue = entry.searchName;
        searchValue = searchValue.toLowerCase();

        return searchValue.includes(currValue);
      });
      setProductsSearchResult(filteredData);
    }
  };

  const handleSelect = (value, option) => {
    //console.log(value);
    //console.log("imp", option);
    setSelectedValue(option.children); //working correctly
    setSelectedProductId(value); //passes productuinqId
  };

  const handleCustomerDelete = () => {
    if (saleInvoiceData.method == "Customer Layby") {
      saleInvoiceData.method = "Cash";
    }
    saleInvoiceData.customer = {};
    setSelectedCutomer("");
    saleInvoiceData.hasCustomer = false;
    setSaleInvoiceData(saleInvoiceData); //imp
    updateCart(saleInvoiceData);
  };

  const handleCustomerSelect = (customerId, option) => {
    //console.log(customerId);
    //console.log("imp-cus", option);
    setSelectedCustomerValue(option.children); //working correctly

    customersData.forEach((cus) => {
      if (cus.customer_id === customerId) {
        setSelectedCutomer(cus); //passes customer
        console.log(cus);
        saleInvoiceData.customer = cus;
        saleInvoiceData.hasCustomer = true;
        return 0;
      }
    });

    //setSaleInvoiceData(saleInvoiceData);
    updateCart(saleInvoiceData);
  };

  const handleDeleteSale = (e) => {
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);
    let newInvoice = createNewInvoice();
    updateCart(newInvoice);
  };

  const handleDiscountChange = (e) => {
    saleInvoiceData.isDiscount = true;
    updateCart(saleInvoiceData);
  };

  const changeMethodOfPayment = (methodName) => {
    saleInvoiceData.method = methodName;
    console.log(methodName);
    setSaleInvoiceData(saleInvoiceData);
    setIsMopModalVisible(false);
  };

  const showModal = () => {
    setIsMopModalVisible(true);
  };

  const handleOk = () => {
    setIsMopModalVisible(false);
  };

  const handleCancel = () => {
    setIsMopModalVisible(false);
  };

  const handleTaxCategoryChange = (taxValue) => {
    //console.log(taxValue);
    if (taxValue == 16) {
      saleInvoiceData.taxCategory = "simple_tax";
    }
    if (taxValue == 5) {
      saleInvoiceData.taxCategory = "punjab_food_fbr";
    }

    updateCart(saleInvoiceData); //imp
  };

  const handleCourierChange = (value) => {
    //console.log(value);
    const clonedInvoice = { ...saleInvoiceData };
    clonedInvoice.courier_code = value;
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, clonedInvoice); //imp
    setSaleInvoiceData(clonedInvoice);
  };

  const handleInvoiceNoteChange = (e) => {
    //console.log(e.target.value);
    const clonedInvoice = { ...saleInvoiceData };
    clonedInvoice.reference = e.target.value;
    saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, clonedInvoice); //imp
    setSaleInvoiceData(clonedInvoice);
  };


  const handlePaidChange = (value) => {
    var inputValue = parseFloat(value);
    //var costFormValues = costForm.getFieldsValue();
    //console.log(costFormValues);
    let paidAmount;
    if (Helpers.var_check(inputValue) && !isNaN(inputValue)) {
      paidAmount = inputValue;
    } else {
      paidAmount = 0;
    }

    const clonedInvoice = { ...saleInvoiceData };
    clonedInvoice.payed = paidAmount.toFixed(2);
    
    //costForm.setFieldsValue({ paid: clonedInvoiceData && clonedInvoiceData.payed }); //imp
    setSaleInvoiceData(clonedInvoice);

  };

  const handleChangeProductsData = (
    productsData,
    productsTotalQuantity = 0
  ) => {
    calculateProductsTotalQuantityAndAmount(productsData);
    //setProductsTableData(productsData);   //calling in updatecart now
    saleInvoiceData.products = productsData;
    updateCart(saleInvoiceData); //imp
  };

  const handleAddProduct = () => {
    var formValues = form.getFieldsValue();

    var productExistsCheck = false;
    var newData = [...productsTableData];
    //productsTableData
    const index = registereProductsData.findIndex(
      (item) => selectedProductId == item.product_id
    );

    if (index > -1) {
      //deep copy
      const selectedItem = JSON.parse(
        JSON.stringify(registereProductsData[index])
      );
      console.log(selectedItem);
      productsTableData.forEach((p) => {
        if (p.product_id === selectedItem.product_id) {
          productExistsCheck = true;
          p.qty += 1;
        }
      }); //end of for loop

      if (productExistsCheck) {
        calculateProductsTotalQuantityAndAmount(productsTableData);
        //setProductsTableData(productsTableData);  // caling in updatecart now imppp
        //update cart  imp
        saleInvoiceData.products = productsTableData;
        saveDataIntoLocalStorage(
          Constants.SELL_CURRENT_INVOICE_KEY,
          saleInvoiceData
        ); //imp
        updateCart(saleInvoiceData);

        //update cart  imp
      }
      if (!productExistsCheck) {
        selectedItem.qty = 1;
        newData.push(selectedItem);
        console.log("imp1-table", newData);
        calculateProductsTotalQuantityAndAmount(newData);
        //setProductsTableData(newData);  // callng in updatecart now imppp
        //update cart  imp
        saleInvoiceData.products = newData;
        saveDataIntoLocalStorage(
          Constants.SELL_CURRENT_INVOICE_KEY,
          saleInvoiceData
        ); //vvimp
        updateCart(saleInvoiceData);

        //update cart  imp
      }
    } //end of top first if
  };

  const calculateProductsTotalQuantityAndAmount = (data) => {
    var productsTotalQuantity = 0;
    var productsTotal = 0;

    const newData = [...data];
    newData.forEach((item) => {
      productsTotal =
        productsTotal +
        parseFloat(item.qty || 0) * parseFloat(item.product_sale_price);
      productsTotalQuantity = productsTotalQuantity + item.qty;
    });

    setProductsTotalQuantity(productsTotalQuantity);
    setProductsTotalAmount(productsTotal);
  };

  const handlePayBill = (status, check = false) => {
    var formValues = form.getFieldsValue();
    console.log("changed", formValues);
    //console.log(status);

    if (productsTableData.length === 0) {
      message.error("No Products Added", 4);
      return;
    }

    var localInvoiceQueue = getSellInvoiceDataFromLocalStorage(
      Constants.SELL_INVOICE_QUEUE_KEY
    );
    console.log(localInvoiceQueue);

    var readFromLocalStorage = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;

    var currentInvoice;

    /*if (check) {
      currentInvoice = readFromLocalStorage;
    }*/


    //var clonedInvoiceData = saleInvoiceData ; //impp here
    //var clonedInvoiceData1 = JSON.parse(JSON.stringify(saleInvoiceData)); //imp to make adeep copy
    //console.log(clonedInvoiceData);

    saleInvoiceData.status = status; //imp
    console.log(saleInvoiceData);
    //updateCart(clonedInvoiceData); // impppp  prev but no need here


    if (Helpers.var_check(localInvoiceQueue.data)) {
      localInvoiceQueue.data.push(saleInvoiceData); //imp  prev
      console.log("invoice-queue-insert");
      saveDataIntoLocalStorage(
        Constants.SELL_INVOICE_QUEUE_KEY,
        localInvoiceQueue.data
      );
      localStorage.setItem(Constants.SELL_CURRENT_INVOICE_KEY, null); ///imp
    }

    if (status == "close") {
      // print function
      printSalesOverview();
    } else {
      message.success("Invoice held", 5);
    }

    setSelectedCutomer("");
    let newInvoice = createNewInvoice(); //new invoice again
    updateCart(newInvoice);
  };

  const printSalesOverview = () => {
    var previewSalesInvoiceHtml = document.getElementById("printSalesTable")
      .innerHTML;
    var doc =
      '<html><head><title>Close Me ~ Shopdesk</title><link rel="stylesheet" type="text/css" href="/printInvoice.scss" /></head><body onload="window.print(); window.close();">' +
      previewSalesInvoiceHtml +
      "</body></html>";
    /* NEW TAB OPEN PRINT */
    var popupWin = window.open("", "_blank");
    popupWin.document.open();
    // window.print(); window.close(); 'width: 80%, height=80%'
    popupWin.document.write(doc);
    //popupWin.document.close();  //vvimp for autoprint
  };

  ////////////////imp funcyionality////////////////////

  const startInvoice = () => {
    var readFromLocalStorage = getDataFromLocalStorage(
      Constants.SELL_CURRENT_INVOICE_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;

    //console.log("local-inoice-data-before", readFromLocalStorage);

    let currentInvoice = {};
    var localInvoiceQueue = getSellInvoiceDataFromLocalStorage(
      Constants.SELL_INVOICE_QUEUE_KEY
    );
    //console.log(localInvoiceQueue);

    /*-----------set user store id-------------*/
    var userData = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    userData = userData.data ? userData.data : null;

    if (userData) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        setLocalStorageData(userData);
      }
    }


    if (readFromLocalStorage) {
      //currentInvoice = readFromLocalStorage;   //imp prev version
      /*-------------------------new version-------------------------*/
      for (var key in readFromLocalStorage) {
        if (readFromLocalStorage.hasOwnProperty(key)) {
          //console.log(key + "-" + readFromLocalStorage[key]);
          currentInvoice[key] = readFromLocalStorage[key];
        }
      }
      /*-------------------------new version-------------------------*/
      updateCart(currentInvoice);

    } else {
      currentInvoice = createNewInvoice();
      //console.log("see1", currentInvoice);
      updateCart(currentInvoice);
    }

    if (!localInvoiceQueue.data) {
      console.log("invoice-queue-initialization");
      saveDataIntoLocalStorage(Constants.SELL_INVOICE_QUEUE_KEY, []);
    }

    /*-----imp to call sync----*/
    if (clearSync === false) {
      setTimeout(sync, 3000);
    }
    /*-----imp to call sync----*/
  };

  

   ////////////////imp functionality////////////////////

  // Invoice Sync Function
  const sync = async () => {

    var localInvoiceQueue = getSellInvoiceDataFromLocalStorage(
      Constants.SELL_INVOICE_QUEUE_KEY
    );

    localInvoiceQueue = localInvoiceQueue.data
      ? localInvoiceQueue.data
      : null;

    //console.log(localInvoiceQueue);

    if (
      Helpers.var_check(localInvoiceQueue) &&
      localInvoiceQueue.length > 0
    ) {

      setSyncStatus(true);
      const registerInvoiceResponse = await SalesApiUtil.registerInvoice(localInvoiceQueue);
      console.log(
        " registerInvoiceResponse:",
        registerInvoiceResponse
      );

      if (registerInvoiceResponse.hasError) {
        console.log(
          "Cant add registered Invoice Data -> ",
          registerInvoiceResponse.errorMessage
        );
        message.error(registerInvoiceResponse.errorMessage, 3);
        setSyncStatus(false);
        console.log("Fail");
        setTimeout(sync, 3000);

      }
      else {
        var index = -1;
        var invoicesData = registerInvoiceResponse.Invoices_added;
        for (let i in invoicesData) {
          for (let i2 in localInvoiceQueue) {
            if (
              invoicesData[i] ==
              localInvoiceQueue[i2].invoiceNo
            ) {
              index = i2;
              break;
            }
          }
          if (index != -1) {
            console.log("imp-sync-queue-inserted-val", localInvoiceQueue[index]);
            localInvoiceQueue.splice(index, 1);
            saveDataIntoLocalStorage(Constants.SELL_INVOICE_QUEUE_KEY, localInvoiceQueue);
            console.log(index);
          }
        }


        console.log(invoicesData);
        setTimeout(sync, 3000);

      }
    }

    else {
      setSyncStatus(false);
      if (clearSync === false) {
        setTimeout(sync, 3000);
      }
      //console.log("-- syncing --");
    }

  }

    ////////////////imp functionality////////////////////

    ////////////////imp functionality////////////////////

  function createNewInvoice() {
    ///////////////
    /*-----------set user store id-------------*/
    var readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        setLocalStorageData(readFromLocalStorage);
      }
    }
    /*-----------set user store------------*/

    // $scope.invoice
    var data = {};
    data.isDiscount = false;
    data.dateTime = moment(new Date()).format("yyyy/MM/DD hh:mm:ss");
    data.invoiceNo = Helpers.uniqid();
    data.store_id = readFromLocalStorage.auth.store_random;
    data.user_id = readFromLocalStorage.user_info.user_random;
    data.method = "Cash";
    data.status = "current";
    data.products = [];
    data.tax = 0;
    data.total = 0;
    data.sub_total = 0;
    data.payed = 0;
    data.return = false;
    data.customer = {};
    data.discountVal = 0;
    data.hasCustomer = false;
    data.discountAmount = 0;
    data.courier_code = "";

    setSaleInvoiceData(data);

    return data;
  }

  function updateCart(invoiceData) {
    var formValues = form.getFieldsValue();
    var costFormValues = costForm.getFieldsValue();

    //console.log(formValues);
    //console.log(costFormValues);

    //var clonedInvoiceData = JSON.parse(JSON.stringify(invoiceData));
    //var clonedInvoiceData = { ...invoiceData };   //imp prev version
    let clonedInvoiceData = {};
    /*-------------------new version----------------*/
    for (var key in invoiceData) {
      if (invoiceData.hasOwnProperty(key)) {
          //console.log(key + "-" + invoiceData[key]);
          clonedInvoiceData[key] = invoiceData[key];
      }
   }
    /*-------------------new version---------------*/

    for (var key in invoiceData) {
      delete invoiceData[key];
    }

    var tableProducsData = clonedInvoiceData ? clonedInvoiceData.products : [];

    clonedInvoiceData.tax = 0;
    clonedInvoiceData.sub_total = 0;
    clonedInvoiceData.total = 0;

    for (let i in tableProducsData) {
      if (Helpers.var_check(tableProducsData[i].qty))
        tableProducsData[i].qty = parseInt(tableProducsData[i].qty);
      else tableProducsData[i].qty = 0;
      if (Helpers.var_check(tableProducsData[i].product_sale_price))
        tableProducsData[i].product_sale_price = parseFloat(
          parseFloat(tableProducsData[i].product_sale_price).toFixed(2)
        );
      else tableProducsData[i].product_sale_price = 0;

      clonedInvoiceData.tax +=
        ((Helpers.var_check(formValues.tax_value)
          ? formValues.tax_value
          : tableProducsData[i].tax_value) *
          (tableProducsData[i].qty * tableProducsData[i].product_sale_price)) /
        100;

      clonedInvoiceData.sub_total +=
        tableProducsData[i].product_sale_price * tableProducsData[i].qty;
    } //enf of for loop

    clonedInvoiceData.products = tableProducsData; //imp
    setProductsTableData(tableProducsData); //vvimp

    clonedInvoiceData.total +=
      clonedInvoiceData.tax + clonedInvoiceData.sub_total;
    clonedInvoiceData.tax = parseFloat(
      parseFloat(clonedInvoiceData.tax).toFixed(2)
    );
    clonedInvoiceData.sub_total = parseFloat(
      parseFloat(clonedInvoiceData.sub_total).toFixed(2)
    );
    clonedInvoiceData.total = parseFloat(
      parseFloat(clonedInvoiceData.total).toFixed(2)
    );

   
    /*-------------------new version----------------------------------------*/
    let discountedInputValue = 0 ;
    if(costFormValues.discounted_value){
      discountedInputValue = costFormValues.discounted_value;
    }
    else if(clonedInvoiceData.discountVal){
      discountedInputValue = clonedInvoiceData.discountVal;
    }
    /*-------------------new version----------------------------------------*/

    /*let discountedInputValue = (Helpers.var_check(costFormValues.discounted_value)) ? costFormValues.discounted_value
      : (clonedInvoiceData.discountVal) ? clonedInvoiceData.discountVal : 0;   imp prev version */ 
    

    discountedInputValue = parseInt(discountedInputValue).toFixed(2);
    //console.log(discountedInputValue);
    discountedInputValue = parseFloat(discountedInputValue);

    clonedInvoiceData.discountVal = discountedInputValue;

    clonedInvoiceData.discountAmount = parseFloat(
      ((discountedInputValue * clonedInvoiceData.total) / 100).toFixed(2)
    );
    clonedInvoiceData.payed = parseFloat(
      parseFloat(
        clonedInvoiceData.total - clonedInvoiceData.discountAmount
      ).toFixed(2)
    );

    setSaleInvoiceData(clonedInvoiceData); //imp
    console.log(clonedInvoiceData);


    costForm.setFieldsValue({
      paid: clonedInvoiceData && clonedInvoiceData.payed,
      discounted_value: clonedInvoiceData && clonedInvoiceData.discountVal
    }); //imp


    if (tableProducsData.length > 0) {
      saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, clonedInvoiceData);  //imp
    }

    //saveDataIntoLocalStorage("current_invoice", clonedInvoiceData);   //imp
  }

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  console.log(saleInvoiceData);

  const { Panel } = Collapse;

  function callback(key) {
    console.log(key);
  }

  return (
    <>
      <div className='page sell'>
        {/* Left */}
        <div className='info'>
          <Form
            form={form}
            name='basic'
            layout='vertical'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >

            <Form.Item label='Search for products'>
              <AutoComplete
                style={{ width: "100%" }}
                dropdownMatchSelectWidth={250}
                value={selectedValue}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder='select a product'
              >
                {productsSearchResult &&
                  productsSearchResult.map((item) => (
                    <Option key={item.product_id} value={item.product_id}>
                      {item.searchName}
                    </Option>
                  ))}
              </AutoComplete>
            </Form.Item>

            <Button
              type='default'
              className='add-product-btn'
              onClick={handleAddProduct}
            >
              Add
            </Button>

            <Form.Item label='Courier' name='courier_code'>
              <Select onChange={handleCourierChange}>
                {couriersData.map((obj, index) => {
                  return (
                    <Option key={obj.courier_id} value={obj.courier_code}>
                      {obj.courier_name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label='Invoice Note'
              name='invoiceNote'
              onChange={handleInvoiceNoteChange}
            >
              <Input placeholder='input Invoice Note' />
            </Form.Item>
            <Form.Item label='Tax Category' name='tax_value'>
              <Select onChange={handleTaxCategoryChange}>
                <Option key='1' value={16}>
                  Simple
                </Option>
                <Option key='2' value={5}>
                  FBS
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        {/* Left */}

        {/* Right */}
        <div className='checkout'>
          <Form
            form={costForm}
            name='basic'
            layout='vertical'
            initialValues={{
              discounted_value: 0,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='checkout__header'>
              <h3>
                Checkout &nbsp; (
                {saleInvoiceData && saleInvoiceData.products
                  ? saleInvoiceData.products.length
                  : 0}
                )Items
              </h3>

              <div className='header__btns'>
                <Button
                  type='primary'
                  onClick={() => handlePayBill("hold")}
                  className='custom-btn custom-btn--primary'
                >
                  Park Sale
                </Button>
                <Button onClick={handleDeleteSale}>Delete Sale</Button>
              </div>
            </div>

            <Form.Item>
              <AutoComplete
                style={{ width: "100%" }}
                dropdownMatchSelectWidth={250}
                value={selectedCustomerValue}
                onSearch={handleCustomerSearch}
                onSelect={handleCustomerSelect}
                placeholder='select customer'
              >
                {customersData &&
                  customersData.map((item) => (
                    <Option key={item.cutomer_id} value={item.customer_id}>
                      {item.customer_name}
                    </Option>
                  ))}
              </AutoComplete>
            </Form.Item>
            <Divider />

            {/*-----------------*/}

            {selectedCutomer && (
              <div
                style={{
                  borderTop: "0px solid #eee",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <table className='sell-customer-select-table'>
                  <tbody>
                    <tr>
                      <th style={{ padding: "5px !important" }}>
                        <i style={{ marginTop: "15px" }}><UserOutlined /></i>
                      </th>
                      <th style={{ padding: "5px !important" }}>
                        <b>{selectedCutomer.customer_name}</b>
                        <br />
                        <small>
                          {selectedCutomer.customer_email} |
                          {selectedCutomer.customer_phone}
                        </small>
                      </th>
                      <th style={{ padding: "5px !important" }}>
                        <button className='customer-del-btn-pull-right'>
                          <DeleteOutlined
                            className='customer-del-btn-icon'
                            onClick={handleCustomerDelete}
                          />
                        </button>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/*-----------------*/}

            <Divider />

            {/* Table */}
            <div className='table'>
              <SellNestedProductsTable
                tableData={productsTableData}
                //tableDataLoading={loading}
                onChangeProductsData={handleChangeProductsData}
                tableType='register_sell'
              />
            </div>
            {/* Table */}

            <Divider />

            <div className='cost'>
              <div className='cost__wrapper'>
                <div className='cost__left'>
                  <div className='cost__box'>
                    <h3>Subtotal</h3>
                    <span>{saleInvoiceData && saleInvoiceData.sub_total}</span>
                  </div>

                  <Form.Item label='Discount' name='discounted_value'>
                    <Input
                      placeholder='0'
                      //defaultValue={0}
                      addonAfter='%'
                      onBlur={handleDiscountChange}
                    />
                  </Form.Item>

                  <div className='cost__box'>
                    <h3>Tax</h3>
                    <span>{saleInvoiceData && saleInvoiceData.tax}</span>
                  </div>

                  <div className='cost__box'>
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={showModal}
                      className='custom-btn custom-btn--primary'
                    >
                      MOP
                    </Button>
                    <span>{saleInvoiceData && saleInvoiceData.method}</span>
                  </div>

                  <Modal
                    title='Select mode of payment'
                    visible={isMopModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <div className='modal__content'>
                      <Button
                        type='primary'
                        icon={<DollarCircleOutlined />}
                        className='u-width-100 custom-btn custom-btn--primary'
                        style={{ marginBottom: "1rem" }}
                        onClick={() => changeMethodOfPayment("Cash")}
                      >
                        Cash
                      </Button>
                      <br />

                      <Button
                        type='primary'
                        icon={<CreditCardOutlined />}
                        className='u-width-100 custom-btn custom-btn--primary'
                        style={{ marginBottom: "1rem" }}
                        onClick={() => changeMethodOfPayment("Credit Card")}
                      >
                        Credit Card
                      </Button>
                      <br />

                      <Button
                        type='primary'
                        icon={<EditOutlined />}
                        className='u-width-100 custom-btn custom-btn--primary'
                        style={{ marginBottom: "1rem" }}
                        onClick={() => changeMethodOfPayment("Online")}
                      >
                        Online
                      </Button>
                      <br />

                      <Button
                        type='primary'
                        icon={<EditOutlined />}
                        className='u-width-100 custom-btn custom-btn--primary'
                        style={{ marginBottom: "1rem" }}
                        onClick={() => changeMethodOfPayment("Customer Layby")}
                      >
                        Customer Layby
                      </Button>
                      <br />
                    </div>
                  </Modal>
                </div>
                <div className='cost__right'>
                  <Form.Item label='Paid' name='paid'>
                    <InputNumber
                      className='u-width-100'
                      //value={saleInvoiceData.payed}
                      onChange={handlePaidChange}
                      disabled={
                        saleInvoiceData && saleInvoiceData.method !== "Cash"
                      }
                    />
                  </Form.Item>

                  <div className='cost__box'>
                    <h3>Change</h3>
                    <span>
                      {saleInvoiceData &&
                        (
                          saleInvoiceData.payed -
                          (saleInvoiceData.total -
                            saleInvoiceData.discountAmount)
                        ).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className='cost__box'>
                    <h3>Discounted Amount</h3>
                    <span>
                      {saleInvoiceData &&
                        (
                          saleInvoiceData.discountAmount && saleInvoiceData.discountAmount.toFixed(2)
                        )}
                    </span>
                  </div>

                </div>
              </div>
              <Form.Item>
                <Button
                  type='primary'
                  onClick={() => handlePayBill("close")}
                  className='cost__btn custom-btn custom-btn--primary'
                  disabled={
                    saleInvoiceData &&
                    saleInvoiceData.products &&
                    saleInvoiceData.products.length < 1
                  }
                >
                  Enter Sale Amount(
                  {saleInvoiceData &&
                    (
                      saleInvoiceData.total - saleInvoiceData.discountAmount
                    ).toFixed(2)}
                  )
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        {/* Right */}
      </div>

      {/* print sales overview */}
      {saleInvoiceData && saleInvoiceData.products && (
        <PrintSalesInvoiceTable
          user={localStorageData}
          invoice={saleInvoiceData}
        />
      )}
    </>
  );
}

export default Sell;
