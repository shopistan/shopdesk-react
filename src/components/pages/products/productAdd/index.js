import React, { useState, useEffect } from "react";
import "./style.scss";
import { useHistory } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
  Space,
  Switch,
  Checkbox,
  Tag,
} from "antd";

import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import * as ProductsApiUtil from "../../../../utils/api/products-api-utils";
import * as TaxexApiUtil from "../../../../utils/api/tax-api-utils";
import * as CategoriesApiUtil from "../../../../utils/api/categories-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import Constants from "../../../../utils/constants/constants";
import * as ProductsVariantsCombination from "./calculateProductsVariantsCombination";
import ProductsVariantsTable from "../../../organism/table/productsNestedTable/productsAdd";





const { TextArea } = Input;
const { Option } = Select;

//const pageLimit = 20;

const ProductAdd = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [userStores, setUserStores] = useState([]);
  const [variant1Tags, setVariant1Tags] = useState([]);
  const [variant2Tags, setVariant2Tags] = useState([]);
  const [variantTagvalue, setVariantTagvalue] = useState("");
  const [
    productVariantsCombinations,
    setproductVariantsCombinations,
  ] = useState([]);
  const [inventoryTrackingCheck, setInventoryTrackingCheck] = useState(true);
  const [variantsCheck, setVariantsCheck] = useState(false);
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productImagePreviewSource, setproductImagePreviewSource] = useState(
    ""
  );
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [inclusiveTax, setInclusiveTax] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  //const [taxesPaginationData, setTaxesPaginationData] = useState({});
  //const [categoriesPaginationData, setCategoriesPaginationData] = useState({});
  //const [isBusy, setIsBusy] = useState(false);
  //const [scrollLoading, setScrollLoading] = useState(false);
  //const [categoriesScrollLoading, setCategoriesScrollLoading] = useState(false);
  const [storeInventoryQty, setStoreInventoryQty] = useState({});



  var mounted = true;



  useEffect(() => {
    fetchProductData();

    return () => {
      mounted = false;
    }

  }, []);

  const fetchProductData = async (values) => {
    /*-----setting products data to fields value------*/
    form.setFieldsValue({
      sku: randomString(12, 16), // 6 hexadecimal characters
    });
    //setproductImagePreviewSource(productsData.product_image);  //imp to set image src here

    /*-----------set user store */
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
        setUserStores(readFromLocalStorage.auth.storeInfo);
      }
    }
    /*-----------set user store */

    /*-----setting products data to fields value------*/
    document.getElementById('app-loader-container').style.display = "block";
    let pageNumber = 1;
    const [categoriesRes, taxesRes] = await Promise.all([
      CategoriesApiUtil.viewAllCategories(),
      TaxexApiUtil.viewAllTaxes(),
    ]);

    /*  categories response  */
    if (categoriesRes.hasError) {
      console.log(
        "getcategoriesRes RESPONSE FAILED -> ",
        categoriesRes.errorMessage
      );
      document.getElementById('app-loader-container').style.display = "none";
    } else {
      console.log("res -> ", categoriesRes);
      if (mounted) {     //imp if unmounted
        setCategories(categoriesRes.categories.data || categoriesRes.categories);
        //setCategoriesPaginationData(categoriesRes.categories.page || {});
      }
    }
    /*  categories response  */

    /*  taxes response  */
    if (taxesRes.hasError) {
      console.log("gettaxesRes RESPONSE FAILED -> ", taxesRes.errorMessage);
      document.getElementById('app-loader-container').style.display = "block";
    } else {
      console.log("res -> ", taxesRes);
      if (mounted) {     //imp if unmounted
        setTaxes(taxesRes.taxes.data || taxesRes.taxes);
        //form.setFieldsValue({ tax: foundObj.tax_id }); //ok correct  for option select value
        //setTaxesPaginationData(taxesRes.taxes.page || {});
      }
    }

    /*  taxes response  */

    if (mounted) {     //imp if unmounted
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }

  };

  var randomString = function (len, bits) {
    bits = bits || 36;
    var outStr = "",
      newStr;
    while (outStr.length < len) {
      newStr = Math.random().toString(bits).slice(2);
      outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
    }
    return outStr.toUpperCase();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    //console.log("changed", values);

    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);

    var addProductData = {}; ///imp
    var productVar1Name = formValues.product_variant1_name;
    var productVar2Name = formValues.product_variant2_name;

    var productVariantsDataDeepClone = JSON.parse(JSON.stringify(productVariantsCombinations)); //imp to make adeep copy
    //var productVariantsDataDeepClone = [...productVariantsCombinations]; //imp to make adeep copy
    //console.log("deepclone", productVariantsDataDeepClone);

    if (productVariantsDataDeepClone.length > 0) {
      productVariantsDataDeepClone.forEach((item, index) => {
        delete item["variant_row_id"];
      });
    }

    var openQtyProductData = [];

    userStores.forEach((storeObj, indx) => {
      openQtyProductData.push({
        store_id: storeObj.store_id,
        qty: formValues[`${storeObj.store_name}`] || 0,
      });
    });

    //console.log("userstores", userStores);


    if (variant1Tags.length > 0 && !Helpers.var_check(formValues.product_variant1_name )) {
      productVar1Name = "Variant 1";}
    if (variant2Tags.length > 0 && !Helpers.var_check(formValues.product_variant2_name )) {
      productVar2Name = "Variant 2";}


    addProductData.sku = formValues.sku;
    addProductData.var = productVariantsDataDeepClone.length > 0 ? true : false; //imp see this later
    addProductData.track = inventoryTrackingCheck;
    addProductData.img = productImagePreviewSource || "def.png"; //need discussion
    if (isImageUpload) {
      addProductData.product_image = productImagePreviewSource;
    }
    addProductData.dec = formValues.product_description
      ? `<div>${formValues.product_description}</div>`
      : "";
    addProductData.tax_id = formValues.tax;
    addProductData.cat_id = formValues.category;
    addProductData.product_name = formValues.product_name;
    addProductData.sale_price = formValues.sale_price;
    if(Helpers.var_check(formValues.purchase_price)){
      addProductData.purchase_price = formValues.purchase_price;
    }
    else{
      addProductData.purchase_price = "";
    }
    addProductData.var1_name = productVar1Name;
    addProductData.var2_name = productVar2Name;
    if (productVariantsDataDeepClone.length > 0) {
      addProductData.varData = productVariantsDataDeepClone;
    } //imp see this later
    addProductData.open_qty = openQtyProductData;
    addProductData.inclusive = inclusiveTax;
    addProductData.attributes =
      JSON.stringify(formValues.product_attributes) || [];


    //console.log("final-post-data", addProductData);


    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    const AddProductResponse = await ProductsApiUtil.addProduct(addProductData);
    console.log("AddProductResponse :", AddProductResponse);
    if (AddProductResponse.hasError) {
      console.log(
        "product Added UnSuccesfully -> ",
        AddProductResponse.errorMessage
      );

      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(AddProductResponse.errorMessage, 2);

    } else {
      console.log("res -> ", AddProductResponse);
      if (mounted) {     //imp if unmounted
        document.getElementById('app-loader-container').style.display = "none";
        message.success(AddProductResponse.message, 1);
        setTimeout(() => {
          history.push({
            pathname: "/products",
          });
        }, 1200);
      }

    }
    
  };

  /*function removeHTML(str) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }*/


  const handleUpload = async () => {
    //console.log(fileList[0]);   //imp
    document.getElementById('app-loader-container').style.display = "block";
    const ImageUploadResponse = await ProductsApiUtil.imageUpload(fileList[0]);
    console.log("ImageUploadResponse:", ImageUploadResponse);
    if (ImageUploadResponse.hasError) {
      console.log(
        "Product Image Cant Upload -> ",
        ImageUploadResponse.errorMessage
      );
      document.getElementById('app-loader-container').style.display = "none";
      message.error("Product  Image Cant Upload", 3);
    } else {
      console.log("res -> ", ImageUploadResponse);
      document.getElementById('app-loader-container').style.display = "none";
      message.success(ImageUploadResponse.message, 3);
      setFileList([]);
      setproductImagePreviewSource(ImageUploadResponse.upload_data);
      setIsImageUpload(true);
    }
  };

  const imageUploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);

      return false;
    },
    fileList,
  };

  const onRemoveImage = (file) => {
    setFileList([]);
  };

  const onInclusiveTaxChecked = (e) => {
    setInclusiveTax(e.target.checked);
  };

  const handleTrackingSwitch = (checked) => {
    setInventoryTrackingCheck(checked);
  };

  const handleVariantsSwitch = (checked) => {
    if (checked) {
      setInventoryTrackingCheck(false);
    }
    setVariantsCheck(checked);
    setInventoryTrackingCheck(true);   //new one
  };


  const handleInventoryQtyChange = (value) => {

    var formValues = form.getFieldsValue();
    //console.log(formValues);
    let storeInventory = {...storeInventoryQty};
    userStores.forEach((storeObj, indx) => {
      storeInventory[storeObj.store_id] = formValues[storeObj.store_name];
    });

    //console.log("updateqtyobj", storeInventory);
    setStoreInventoryQty(storeInventory);

  };


  const handleProductVariantsTagChangeSearch = (value) => {
    console.log(`selected ${value}`);
    setVariantTagvalue(value);
  };

  const handleVariants2TagsKeyDown = (event) => {
    //console.log("keydown");

    if (event.key === "Enter") {
     
      var tags2 = [...variant2Tags];
      if (variantTagvalue && !tags2.includes(variantTagvalue)) {
        tags2.push(variantTagvalue);

        setVariant2Tags(tags2); //outside if must
        setVariantTagvalue("");  //new one
        handleVariantsSelectTags(variant1Tags, tags2);  // new one

      }

    }
  };


  const handleVariants1TagsKeyDown = (event) => {
    //console.log("keydown");

    if (event.key === "Enter") {

      var tags1 = [...variant1Tags];
      if (variantTagvalue && !tags1.includes(variantTagvalue)) {
        tags1.push(variantTagvalue);

        setVariant1Tags(tags1); //outside if must
        setVariantTagvalue("");  //new one
        handleVariantsSelectTags(tags1, variant2Tags);  // new one

      }

    } else {
      //console.log("not enter");
    }
  };


  const handleVariants1TagsOnBlur = (event) => {
    
    if (variantTagvalue) {
      var tags1 = [...variant1Tags];
      if (!tags1.includes(variantTagvalue)) {
        tags1.push(variantTagvalue);
      }

      setVariant1Tags(tags1); //outside if must
      handleVariantsSelectTags(tags1, variant2Tags);  // new one

    }
    
  };


  const handleVariants2TagsOnBlur = (event) => {

    if (variantTagvalue) {
      var tags2 = [...variant2Tags];
      if (!tags2.includes(variantTagvalue)) {
        tags2.push(variantTagvalue);
      }
      setVariant2Tags(tags2); //outside if must
      handleVariantsSelectTags(variant1Tags, tags2);  // new one

    }
    
  };


  const handleSaveUpdatedVariantsData = (updatedVariantsProducts) => {
    //console.log('changed-actual-impp-main', updatedVariantsProducts);
    setproductVariantsCombinations(updatedVariantsProducts);
  };


  /*function tagRender(props) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = event => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        //color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }*/


  const handleSaleChange = (e) => {
    /*let SalePrice = e.target.value;
    const re = /^[0-9\b]+$/;
    //console.log(re.test(e.target.value));
    if (!SalePrice=== '' || !re.test(SalePrice)) {  //if contains alphabets in string
      form.setFieldsValue({
        sale_price: SalePrice.replace(/[^\d.-]/g, '')
      });
    } */

    /*--getting variants combinations--*/
    //console.log("inside");
    //console.log(value);
    setLoading(true);
    var variantsCombinations = ProductsVariantsCombination.calculateVaraintsCombinations(
      variant1Tags,
      variant2Tags,
      form.getFieldsValue(),
      userStores,
      storeInventoryQty,
    );

    setproductVariantsCombinations(variantsCombinations);
    setLoading(false);
    /*--getting variants combinations--*/
  };


  const handlePurchaseChange = (e) => {
    /*let PurchasePrice = e.target.value;
    const re = /^[0-9\b]+$/;
    //console.log(re.test(e.target.value));
    if (!PurchasePrice=== '' || !re.test(PurchasePrice)) {  //if contains alphabets in string
      form.setFieldsValue({
        purchase_price: PurchasePrice.replace(/[^\d.-]/g, '')
      });
    }*/
    
    /*--getting variants combinations--*/
    setLoading(true);
    var variantsCombinations = ProductsVariantsCombination.calculateVaraintsCombinations(
      variant1Tags,
      variant2Tags,
      form.getFieldsValue(),
      userStores,
      storeInventoryQty,
    );

    setproductVariantsCombinations(variantsCombinations);
    setLoading(false);
    /*--getting variants combinations--*/
  };



  const handleTaxChange = (value) => {
    /*--getting variants combinations--*/
    setLoading(true);
    var variantsCombinations = ProductsVariantsCombination.calculateVaraintsCombinations(
      variant1Tags,
      variant2Tags,
      form.getFieldsValue(),
      userStores,
      storeInventoryQty,
    );

    setproductVariantsCombinations(variantsCombinations);
    setLoading(false);
    /*--getting variants combinations--*/
  };




  /*const handleScroll = async (e) => {
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
      let pN = Math.ceil(taxes.length / pageLimit) + 1;

      if (pN <= taxesPaginationData.totalPages) {
        setIsBusy(true);
        setScrollLoading(true);
        const taxesRes = await TaxexApiUtil.viewTaxes(pageLimit, pN);
        if (taxesRes.hasError) {
          console.log("gettaxesRes RESPONSE FAILED -> ", taxesRes.errorMessage);
        } else {
          console.log("res -> ", taxesRes);
          if (mounted) {     //imp if unmounted
            let taxesData = taxesRes.taxes.data || taxesRes.taxes;
            var newData = [...taxes];
            newData.push(...taxesData);
            setTaxes(newData);
            setIsBusy(false);
            setScrollLoading(false);
          }
        }

      }

    }

  }*/

  

  /*const handleCategoriesScroll = async (e) => {
    let height = e.target.clientHeight;
    height = height * 0.5;
    let targetHeight = e.target.scrollHeight - e.target.scrollTop;
    let clientHeight = e.target.clientHeight + height;

    if (targetHeight < clientHeight && !isBusy) {
      let pN = Math.ceil(categories.length / pageLimit) + 1;

      if (pN <= categoriesPaginationData.totalPages) {
        setIsBusy(true);   //imp
        setCategoriesScrollLoading(true);   //imp
        const categoriesRes = await CategoriesApiUtil.viewCategories(pageLimit, pN);
        if (categoriesRes.hasError) {
          console.log("getCategoriesRes RESPONSE FAILED -> ", categoriesRes.errorMessage);
        } else {
          console.log("res -> ", categoriesRes);
          if (mounted) {     //imp if unmounted
            let categoriesData = categoriesRes.categories.data || categoriesRes.categories;
            var newData = [...categories];
            newData.push(...categoriesData);
            setCategories(newData);
            setIsBusy(false);
            setCategoriesScrollLoading(false);
          }
        }

      } 

    } 

  } */



  const handleVariantsSelectTags = (tags1Arr, tags2Arr) => {
    var formValues = form.getFieldsValue();
    /*--getting variants combinations--*/
    setLoading(true);
    var variantsCombinations = ProductsVariantsCombination.calculateVaraintsCombinations(
      tags1Arr,
      tags2Arr,
      formValues,
      userStores,
      storeInventoryQty,
    );

    setproductVariantsCombinations(variantsCombinations);
    setLoading(false);
    /*--getting variants combinations--*/
  };

  const handleVariants1DeSelectTags = (value, e) => {
    var tags1 = [...variant1Tags];
    const index = tags1.findIndex((item) => value === item);
    if (index > -1 ) {
      tags1.splice(index, 1);
      setVariant1Tags(tags1);

      /*--getting variants combinations--*/
      setLoading(true);
      var variantsCombinations = ProductsVariantsCombination.calculateVaraintsCombinations(
        tags1,
        tags1.length > 0 ? variant2Tags : [],
        form.getFieldsValue(),
        userStores,
        storeInventoryQty,
      );

      setproductVariantsCombinations(variantsCombinations);
      setLoading(false);
      /*--getting variants combinations--*/
    }
  };

  const handleVariants2DeSelectTags = (value, e) => {
    var tags2 = [...variant2Tags];
    const index = tags2.findIndex((item) => value === item);
    if (index > -1) {
      tags2.splice(index, 1);
      setVariant2Tags(tags2);

      /*--getting variants combinations--*/
      setLoading(true);
      var variantsCombinations = ProductsVariantsCombination.calculateVaraintsCombinations(
        variant1Tags,
        tags2,
        form.getFieldsValue(),
        userStores,
        storeInventoryQty,
      );

      setproductVariantsCombinations(variantsCombinations);
      setLoading(false);
      /*--getting variants combinations--*/
    }
  };

  const handleCancel = () => {
    history.push({
      pathname: '/products',
    });
  };

  var ProductImageSrc = `${productImagePreviewSource}`; //imp to set image source

  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />New Product</h1>
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
            onFinish={onFinish}
            //onFinishFailed={onFinishFailed}
          >
            <div className="form__row--footer">
              <Button
                type="primary"
                className="custom-btn--primary"
                htmlType="submit"
                disabled={buttonDisabled}
              >
                Add Product
              </Button>
            </div>

            {/* Form Section */}
            <div className="form__section">
              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="SKU"
                    name="sku"
                    rules={[
                      {
                        required: true,
                        message: "Please input SKU",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item
                    label="Product Name"
                    name="product_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input product name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Product Description"
                    name="product_description"
                    /*rules={[
                    {
                      required: true,
                      message: "Please input category name",
                    },
                    ]}*/
                  >
                    <TextArea rows={6} />
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Tax"
                    name="tax"
                    rules={[
                      {
                        required: true,
                        message: "Please input Tax",
                      },
                    ]}
                  >
                    <Select onChange={handleTaxChange}
                      showSearch    //vimpp to seach
                      placeholder="Select Tax"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {taxes.map((obj, index) => {
                        return (
                          <Option key={obj.tax_id} value={obj.tax_id}>
                            {`${obj.tax_name}(${obj.tax_value}%)`}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item
                    label="Select Category"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Select placeholder="Select Category"
                      showSearch    //vimpp to seach
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {categories.map((obj, index) => {
                        return (
                          <Option key={obj.category_id} value={obj.category_id}>
                            {obj.category_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Purchase Price"
                    name="purchase_price"
                    /*rules={[
                      {
                        //required: true,
                        //message: "Required",
                      },
                    ]}*/
                  >
                    <InputNumber
                      min={0}
                      //defaultValue={0}
                      className="u-width-100"
                      onChange={handlePurchaseChange}
                    />
                  </Form.Item>
                </div>

                <div className="form__col">
                  {/* <Form.Item>
                    <span>
                      <Checkbox
                        className='inclusive-sale-price-check'
                        onChange={onInclusiveTaxChecked}
                      >
                        <small>Sale price inclusive of tax</small>
                      </Checkbox>
                    </span>
                  </Form.Item> */}

                  <Form.Item
                    label="Sale Price"
                    name="sale_price"
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      //defaultValue={0}
                      className="u-width-100"
                      onChange={handleSaleChange}
                    />

                  </Form.Item>

                  <Checkbox
                      className='inclusive-sale-price-check'
                      onChange={onInclusiveTaxChecked}
                    >
                      <small>Sale price inclusive of tax</small>
                  </Checkbox>

                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Product Image"
                    name="iamge"
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <Upload {...imageUploadProps} onRemove={onRemoveImage}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </div>

                <div className="form__col form__col--button">
                  <Form.Item className="u-width-100">
                    <Button type="default" onClick={handleUpload}>
                      Upload
                    </Button>
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item>
                    <img className="thumbnail" src={ProductImageSrc}></img>
                  </Form.Item>
                </div>
              </div>
              {/* Row */}
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className="form__section">
              <div className="form__section__header">
                <h2>Attributes</h2>
                <p>
                  The attributes allows you to store additional information for
                  products. You cannot search for attributes or filter by an
                  attribute.
                </p>
              </div>

              <div>
                <Form.List name="product_attributes" className="attribute">
                  {(fields, { add, remove }) => (
                    <div className="form__row form__row--full-col">
                      <div className="form__col">
                        {fields.map((field) => (
                          <Space
                            key={field.key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                            className="attribute__wrapper"
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "key"]}
                              fieldKey={[field.fieldKey, "key"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing Atrribute Key",
                                },
                              ]}
                              className="attribute__input"
                            >
                              <Input placeholder="Key" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "value"]}
                              fieldKey={[field.fieldKey, "value"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing Attribute Value",
                                },
                              ]}
                              className="attribute__input"
                            >
                              <Input placeholder="Value" />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Space>
                        ))}
                      </div>

                      <div className="form__col">
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Attribute
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  )}
                </Form.List>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className="form__section">
              <div className="form__section__header">
                <div className="switch__row">
                  <h2>Inventory Tracking</h2>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                    onChange={handleTrackingSwitch}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__col">
                  <p>
                    Leave this on if you want to keep track of your inventory
                    quantities. You'll be able to report on cost of goods sold,
                    product performance, and projected weeks cover, as well as
                    manage your store using inventory orders, transfers and
                    rolling inventory counts.
                  </p>
                </div>
              </div>

              <div className="form__row opening-qty-margin">
                <div className="form__col">
                  <h3> Opening Quantity </h3>
                </div>
              </div>

              {/*outlets quantity*/}
              {userStores.length > 0 &&
                inventoryTrackingCheck &&
                !variantsCheck && (
                  <div className="inventory-tracking">
                    {userStores.map((store, index) => {
                      console.log(store.store_name);
                      return (
                        <div  key={store.store_id} className="inventory-tracking__field">
                          <Form.Item
                            label={store.store_name}
                            name={store.store_name}
                          >
                            <InputNumber
                              //defaultValue={0}
                              className="u-width-100"
                              onChange={handleInventoryQtyChange}
                            />
                          </Form.Item>
                        </div>
                      );
                    })}
                  </div>
                )}
              {/*outlets quantity*/}
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className="form__section">
              <div className="form__section__header">
                <div className="switch__row">
                  <h2>Variant Products</h2>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    //defaultChecked
                    onChange={handleVariantsSwitch}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__col">
                  <p>
                    These are products that have different versions, like size
                    or color. Turn this on to specify up to two attributes (like
                    color), and unlimited values for each attribute (like green,
                    blue, black).
                  </p>
                </div>
              </div>

              {/* <div className='form__row form__row--variant'>
                <div className='form__col'>
                  <h4>Attribute</h4>
                </div>

                <div className='form__col'>
                  <h4>Value</h4>
                </div>
              </div> */}

              {variantsCheck && (
                <div>
                  {/*-Row-*/}
                  <div className="form__row">
                    <div className="form__col">
                      <Form.Item
                        label="Attribute(e.g color, size)"
                        name="product_variant1_name"
                      >
                        <Input placeholder="Attribute Name" />
                      </Form.Item>
                    </div>
                    <div className="form__col">
                      <Form.Item
                        label="Value(e.g green, blue, red)"
                        name="product_variant1_values"
                      >
                        <Select
                          mode="tags"
                          //allowClear
                          style={{ width: "100%" }}
                          placeholder="Add a tag"
                          onSearch={handleProductVariantsTagChangeSearch}
                          //onSelect={handleVariantsSelectTags}  //not using now
                          onKeyDown={handleVariants1TagsKeyDown}
                          onDeselect={(value, e) => handleVariants1DeSelectTags(value, e)}
                          dropdownStyle	={{display: "none"}}   //imp
                          onBlur={handleVariants1TagsOnBlur}
                          
                        >
                          {variant1Tags.length > 0 &&
                            variant1Tags.map((obj, index) => {
                              return (
                                <Option key={index} value={obj}>
                                  {obj}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>

                  {/*-Row-*/}

                  <div className="form__row">
                    <div className="form__col">
                      <Form.Item label="Attribute" name="product_variant2_name">
                        <Input
                          placeholder="Attribute Name"
                          disabled={variant1Tags.length > 0 ? false : true}
                        />
                      </Form.Item>
                    </div>
                    <div className="form__col">
                      <Form.Item label="Value" name="product_variant2_values">
                        <Select
                          mode="tags"
                          //allowClear
                          style={{ width: "100%" }}
                          placeholder="Add a tag"
                          onSearch={handleProductVariantsTagChangeSearch}
                          onKeyDown={handleVariants2TagsKeyDown}
                          onDeselect={(value, e) => handleVariants2DeSelectTags(value, e)}
                          dropdownStyle	={{display: "none"}}   //imp
                          onBlur={handleVariants2TagsOnBlur}
                          disabled={variant1Tags.length > 0 ? false : true}
                          
                        >
                          {variant2Tags.length > 0 &&
                            variant2Tags.map((obj, index) => {
                              return (
                                <Option key={index} value={obj}>
                                  {obj}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form__row">
                    {/* Table */}
                    <div className="table" style={{width: "100%"}}>
                      <ProductsVariantsTable
                        tableData={productVariantsCombinations}
                        tableDataLoading={loading}
                        onChangeProductsVariantsData={
                          handleSaveUpdatedVariantsData
                        }
                        taxes={taxes}
                        userStores={userStores}
                      />
                    </div>
                    {/* Table */}
                  </div>
                </div>
              )}
            </div>
            {/* Form Section */}

            <div className="form__row--footer">
              <Button
                type="primary"
                className="custom-btn--primary"
                htmlType="submit"
                disabled={buttonDisabled}
              >
                Add Product
              </Button>
            </div>

          </Form>
        </div>
      </div>}
    </div>
  );
};

export default ProductAdd;
