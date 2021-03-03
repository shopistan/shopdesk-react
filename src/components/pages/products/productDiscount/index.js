import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { PlusCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import ProductsDiscountsTable from "../../../organism/table/productsNestedTable/productsDiscounts";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
//import { values } from "lodash";


const ProductDiscount = () => {
  const [paginationLimit, setPaginationLimit] = useState(20);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [discountedRows, setDiscountedRows] = useState([]);
  const [discountedRowsKeys, setDiscountedRowsKeys] = useState([]);


  const { Option } = Select;
  const { Search } = Input;

  const onSearch = async (e) => {
    var searchValue = e.target.value;
    if (searchValue === "") {
      fetchProductsDiscountsData(paginationLimit, currentPage);
    }
    else {
      var pageNumber = 1;
      const productsSearchResponse = await ProductsApiUtil.searchProducts(paginationLimit, pageNumber, searchValue);
      console.log('productsSearchResponse:', productsSearchResponse);
      if (productsSearchResponse.hasError) {
        console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
      }
      else {
        console.log('res -> ', productsSearchResponse);
        const newData = [...productsSearchResponse.products.data];
        newData.forEach((itemObj, indx) => {
          if (itemObj.hasOwnProperty('discounted_price') !== true) {
            itemObj.discounted_price = 0;
          }
        }); /*--end of foreach--*/

        //console.log("newdata-search", newData);
        setData(newData);
        setPaginationData(productsSearchResponse.products.page);
      }
    }

  }

  const fetchProductsDiscountsData = async (pageLimit = 20, pageNumber = 1) => {
    const productsDiscountsViewResponse = await ProductsApiUtil.getRegisteredProducts(pageLimit, pageNumber);
    console.log(' productsDiscountsViewResponse:', productsDiscountsViewResponse);

    if (productsDiscountsViewResponse.hasError) {
      console.log('Cant fetch products Discounts Data -> ', productsDiscountsViewResponse.errorMessage);
      message.error('Cant fetch products Discounts Data ', 3);
      setLoading(false);
    }
    else {
      console.log('res -> ', productsDiscountsViewResponse);
      message.success(productsDiscountsViewResponse.message, 3);
      setData(productsDiscountsViewResponse.products.data);
      setPaginationData(productsDiscountsViewResponse.products.page);
      setLoading(false);
    }
  }


  const saveProductsDiscountedData = async (ProductDiscountedData) => {
    const saveproductsDiscountedDataResponse = await ProductsApiUtil.saveProductsDiscountedData(ProductDiscountedData);
    console.log('saveproductsDiscountedDataResponse:', saveproductsDiscountedDataResponse);

    if (saveproductsDiscountedDataResponse.hasError) {
      console.log('Cant save products Discounted Data -> ', saveproductsDiscountedDataResponse.errorMessage);
      message.error('Cant save products Discounted Data ', 3);
      setLoading(false);
    }
    else {
      console.log('res -> ', saveproductsDiscountedDataResponse);
      message.success(saveproductsDiscountedDataResponse.message, 3);
      setLoading(false);
    }
  }


  useEffect(async () => {
    fetchProductsDiscountsData();
  }, []);


  function handleChange(value) {
    setPaginationLimit(value);
    //setCurrentPage(1);
    setLoading(true);
    if (currentPage > Math.ceil(paginationData.totalElements / value)) {
      fetchProductsDiscountsData(value, 1);
    }
    else {
      fetchProductsDiscountsData(value, currentPage);
    }
  }

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchProductsDiscountsData(paginationLimit, currentPg);
  }


  const onApplyDiscount = (value) => {
    var discountedValue = value;

    if (discountedRowsKeys.length === 0) {
      message.error('Please select Rows ', 4);
    }
    else {
      const newData = [...data];
      discountedRowsKeys.forEach((val, indx) => {
        const index = newData.findIndex(item => val === item.product_id);
        if (index > -1) {
          const item = newData[index];
          if (item.hasOwnProperty('discounted_price')) {
            item.discounted_price = (item.product_sale_price - ((parseFloat(item.product_sale_price) * discountedValue) / 100));
            newData.splice(index, 1, {
              ...item
            });
          }
        }
      }); /*--end of foreach--*/

      setData(newData);
      console.log("save-values-new", newData); //coreect
    }

  };


  const handleSelectedRows = (selectedRowKeys, selectedRows) => {
    //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    setDiscountedRows(selectedRows);
    setDiscountedRowsKeys(selectedRowKeys);

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values) => {
    console.log('changed', values);
    saveProductsDiscountedData(data);

  };

  const handleSaveSpecialPrice = (updatedDiscountProducts) => {
    console.log('changed', updatedDiscountProducts);
    setData(updatedDiscountProducts);
  };



  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Product Discounts</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form name='basic' layout='vertical'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row--footer'>
              <Button type='primary' className='product-btn-edit' htmlType='submit' >
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
                      //enterButton='Search'
                      size='large'
                      onChange={onSearch}
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
            paginationData={paginationData} onClickPageChanger={handlePageChange}
            onSelectedTableRows={handleSelectedRows}
            onSaveProductsSpecialPrice={handleSaveSpecialPrice} />
        </div>

      </div>
    </div>
  );
};

export default ProductDiscount;
