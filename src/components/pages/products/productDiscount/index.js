import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { useHistory } from "react-router-dom";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import ProductsDiscountsTable from "../../../organism/table/productsNestedTable/productsDiscounts";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';



const ProductDiscount = () => {
  const history = useHistory();
  const [paginationLimit, setPaginationLimit] = useState(20);
  //const [paginationData, setPaginationData] = useState({});
  //const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [discountedRows, setDiscountedRows] = useState([]);
  const [discountedRowsKeys, setDiscountedRowsKeys] = useState([]);
  const [selectedDiscountedProducts, setSelectedDiscountedProducts] = useState([]);


  let selectedDiscountedProductsData = [];

  let mounted = true;


  const { Option } = Select;
  const { Search } = Input;


  const onSearch = (value) => {
    //console.log(value);
    var currValue = value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
      setLoading(true);
      fetchProductsDiscountsData();
    } else {
      const filteredData = data.filter((entry) => {
        var productName = entry.product_name;
        productName = productName.toLowerCase();
        var productSku = entry.product_sku;
        productSku = productSku.toLowerCase();
        var discountedPrice = entry.discounted_price;
        var salePrice = entry.product_sale_price;
      
        return (
          productName.includes(currValue) ||
          productSku.includes(currValue) ||
          discountedPrice.includes(currValue)||
          salePrice.includes(currValue)
        );
      });

      setData(filteredData);
    }
  };


  const fetchProductsDiscountsData = async (pageLimit = 20, pageNumber = 1) => {
    document.getElementById('app-loader-container').style.display = "block";
    const productsDiscountsViewResponse = await ProductsApiUtil.getFullRegisteredProducts();
    console.log(' productsDiscountsViewResponse:', productsDiscountsViewResponse);

    if (productsDiscountsViewResponse.hasError) {
      console.log('Cant fetch products Discounts Data -> ', productsDiscountsViewResponse.errorMessage);
      //message.error('Cant fetch products Discounts Data ', 3);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', productsDiscountsViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(productsDiscountsViewResponse.message, 3);
        setData(productsDiscountsViewResponse.products.data || productsDiscountsViewResponse.products);
        //setPaginationData(productsDiscountsViewResponse.products.page || {});
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  const saveProductsDiscountedData = async (ProductDiscountedData) => {
    //console.log(ProductDiscountedData);
    document.getElementById('app-loader-container').style.display = "block";
    const saveproductsDiscountedDataResponse = await ProductsApiUtil.saveProductsDiscountedData(ProductDiscountedData);
    console.log('saveproductsDiscountedDataResponse:', saveproductsDiscountedDataResponse);

    if (saveproductsDiscountedDataResponse.hasError) {
      console.log('Cant save products Discounted Data -> ', saveproductsDiscountedDataResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(saveproductsDiscountedDataResponse.errorMessage, 2);
    }
    else {
      console.log('res -> ', saveproductsDiscountedDataResponse);
      if (mounted) {     //imp if unmounted  
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        message.success(saveproductsDiscountedDataResponse.message, 1);
        setTimeout(() => {
          history.push({
            pathname: '/products',
          });
        }, 1200);

      }

    }
  }


  useEffect( () => {
    fetchProductsDiscountsData();
    return () => {
      mounted = false;
    }

  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    //setCurrentPage(1);
    /*setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchProductsDiscountsData(value, 1);
    }
    else {
      fetchProductsDiscountsData(value, currentPage);
    } */
  }

  /*function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchProductsDiscountsData(paginationLimit, currentPg);
  }*/


  const onApplyDiscount = (value) => {
    var discountedValue = value;

    if (discountedRowsKeys.length === 0) {
      message.error('Please select Rows ', 4);
    }
    else {
      const newData = [...data];
      let newDataSelected = [...selectedDiscountedProducts];   //imp new one
      discountedRowsKeys.forEach((val, indx) => {
        const index = newData.findIndex(item => val === item.product_id);
        if (index > -1) {      //if item found
          const item = newData[index];
          if (item.hasOwnProperty('discounted_price')) {
            item.discounted_price = (item.product_sale_price - ((parseFloat(item.product_sale_price) * discountedValue) / 100));
            //console.log("founddisitem", item);
            newData.splice(index, 1, {
              ...item
            });

            /*-----------------------------------------*/
            const indexSelected = newDataSelected.findIndex(selectedObj => item.product_id === selectedObj.product_id);
            if (indexSelected > -1) {      // if item found
                newDataSelected.splice(indexSelected, 1, {
                    ...item,
                });
            }
            else {       //if item not found
              newDataSelected.push(item);
            }
            /*-----------------------------------------*/

          }  /*--end of inner if condition--*/

        }  /*--end of found if condition--*/

      }); /*--end of foreach--*/


      setData(newData);
      message.success("Discount applied", 3);
      //console.log("newData-selected-for-discounts", newDataSelected);
      setSelectedDiscountedProducts(newDataSelected);  //imp but no need here
      //console.log("save-values-new", newData); //correct

    }

  };



  const handleSetSelectedDiscountedProducts = (productsDiscountedObj) => {
    let newDataSelected = [...selectedDiscountedProducts];
    //console.log(newDataSelected);
    //console.log("prod", productsDiscountedObj);
    //console.log("prod-id", productsDiscountedObj.product_id);
    const index = newDataSelected.findIndex(item => productsDiscountedObj.product_id === item.product_id);
    if (index > -1) {      // if item found
        //const item = newData[index];
        //console.log("found");
        newDataSelected.splice(index, 1, {
            ...productsDiscountedObj,
        });
    }
    else {       //if item not found
      //console.log("not-found");
      newDataSelected.push(productsDiscountedObj);
    }

    //console.log("newData", newDataSelected);
    setSelectedDiscountedProducts(newDataSelected);  //imp need here

  };


  const handleSelectedRows = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    setDiscountedRows(selectedRows);
    setDiscountedRowsKeys(selectedRowKeys);

  };


  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  const onFinish = async (values) => {
    //console.log('changed', values);
    //saveProductsDiscountedData(data);    // imp prev version
    console.log('selected-products-for-discounts', selectedDiscountedProducts);
    saveProductsDiscountedData(selectedDiscountedProducts);   //imp here new one

  };


  const handleSaveSpecialPrice = (updatedDiscountProducts, selectedProductsDiscountedItem) => {
    //console.log('changed', updatedDiscountProducts);
    setData(updatedDiscountProducts);
    handleSetSelectedDiscountedProducts(selectedProductsDiscountedItem);  //imp to call here 

  };


  const handleCancel = () => {
    history.push({
      pathname: '/products',
    });
  };



  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Product Discounts</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form name='basic' layout='vertical'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row--footer'>
              <Button type='primary' className="custom-btn custom-btn--primary" htmlType='submit' >
                Save
              </Button>
            </div>

            <div className='form__section'>
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='Search Products'
                    name='search_product_name'
                  >
                    <Search
                      placeholder='Search for Products'
                      allowClear
                      enterButton='Search'
                      size='large'
                      onSearch={onSearch}
                      //onChange={onSearch}
                    />
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Discount Percentage'
                    name='applied_discount_value'
                  >
                    <Search
                      placeholder='Discount Percentage'
                      allowClear
                      enterButton='Apply'
                      size='large'
                      maxLength={3}
                      icon={<CheckCircleOutlined />}
                      onSearch={onApplyDiscount}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    name='discount_apply'
                  >
                    <div className='action-row__element'>
                      Show
                      <Select
                        defaultValue='10'
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

                  </Form.Item>
                </div>
              </div>

            </div>
          </Form>
        </div>

        <div className='table'>{/* Insert Table Here */}
          <ProductsDiscountsTable
            pageLimit={paginationLimit} tableData={data} tableDataLoading={loading}
            //paginationData={paginationData}
            //onClickPageChanger={handlePageChange}
            onSelectedTableRows={handleSelectedRows}
            onSaveProductsSpecialPrice={handleSaveSpecialPrice} />
        </div>

      </div>
    </div>
  );
};

export default ProductDiscount;
