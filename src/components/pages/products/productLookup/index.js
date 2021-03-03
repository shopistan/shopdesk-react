import React, { useState, useEffect } from "react";
import "../productsStyleMain.scss";
import {
  ProfileOutlined,
} from "@ant-design/icons";
import { Input, AutoComplete, Select, Button, message } from "antd";
import ProductsNestedTable from "../../../organism/table/productsNestedTable/productsViewNestedTable";
import ProductsLookUpTable from "../../../organism/table/productsNestedTable/productsLookUp";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';


const ProductLookup = () => {
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductLookUpId, setSelectedProductLookUpId] = useState("");
  const [variantsTableCheck, setVariantsTableCheck] = useState(false);
  const [lookUpTableCheck, setlookUpTableCheck] = useState(false);


  const { Search } = Input;
  const { Option } = Select;


  useEffect(async () => {

  }, []);


  const handleSearch = async (value: string) => {
    setSelectedValue(value);

    const productsSearchResponse = await ProductsApiUtil.searchProductsByName(value);
    console.log('productsSearchResponse:', productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log('Cant Search Products -> ', productsSearchResponse.errorMessage);
    }
    else {
      console.log('res -> ', productsSearchResponse);
      setProductsSearchResult(productsSearchResponse);
    }

  };


  const handleSelect = (value, option) => {
    setSelectedValue(option.children);
    setSelectedProduct(value);  //passes productuinqId
  };


  const handleFetchProductLookupData = (rowData) => {
    setSelectedProductLookUpId(rowData.product_sku);
    setlookUpTableCheck(true);

  };

  const handleFetchProduct = (data) => {
    if (selectedValue === '') { message.warning('please select product', 3); }
    else {
      setVariantsTableCheck(true);
    }
  };



  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Product Lookup</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <h2>Select a Product</h2>

          <AutoComplete style={{ width: "100%" }}
            dropdownMatchSelectWidth={500}
            value={selectedValue}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="select a product">
            {productsSearchResult.product && productsSearchResult.product.map((item) => (
              <Option key={item.product_unique} value={item.product_unique}>
                {item.product_name}
              </Option>
            ))}
          </AutoComplete>

          <div className='fetch-product-row'>
            <Button type='default' className='fetch-product-btn'
              icon={<ProfileOutlined />}
              onClick={() => handleFetchProduct()}>
              fetch
            </Button>
          </div>

          {variantsTableCheck &&
            <div className='table'>{/* Insert Table Here */}
              <div className='form__section__header'>
                <h3 className='variants-heading'>Product Variants</h3>
              </div>
              <ProductsNestedTable productUniqId={selectedProduct} originPage={"lookup"}
                onClickFetchProductLookupData={handleFetchProductLookupData} />
            </div>}

          {variantsTableCheck && lookUpTableCheck &&
            <div className='table'>{/* Insert Table Here */}
              <div className='form__section__header'>
                <h3 className='lookup-heading'>Product Lookup Data</h3>
              </div>
              <ProductsLookUpTable productSku={selectedProductLookUpId} />
            </div>}

        </div>
      </div>
    </div>
  );
};

export default ProductLookup;
