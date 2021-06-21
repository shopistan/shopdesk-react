import React, { useState, useEffect } from "react";
import "../productsStyleMain.scss";
import { ProfileOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Input, AutoComplete, Select, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import ProductsNestedTable from "../../../organism/table/productsNestedTable/productsViewNestedTable";
import ProductsLookUpTable from "../../../organism/table/productsNestedTable/productsLookUp";
import * as ProductsApiUtil from "../../../../utils/api/products-api-utils";



const ProductLookup = () => {
  const history = useHistory();
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductLookUpId, setSelectedProductLookUpId] = useState("");
  const [variantsTableCheck, setVariantsTableCheck] = useState(false);
  const [lookUpTableCheck, setlookUpTableCheck] = useState(false);

  const { Search } = Input;
  const { Option } = Select;

  useEffect(() => {}, []);

  const handleSearch = async (value) => {
    setSelectedValue(value);

    const productsSearchResponse = await ProductsApiUtil.searchProductsByName(
      value
    );
    console.log("productsSearchResponse:", productsSearchResponse);
    if (productsSearchResponse.hasError) {
      console.log(
        "Cant Search Products -> ",
        productsSearchResponse.errorMessage
      );
    } else {
      console.log("res -> ", productsSearchResponse);
      setProductsSearchResult(productsSearchResponse);
    }
  };

  const handleSelect = (value, option) => {
    setSelectedValue(option.children);
    setSelectedProduct(value); //passes productuinqId
    setVariantsTableCheck(false); //imp to set here
  };

  const handleFetchProductLookupData = (rowData) => {
    setSelectedProductLookUpId(rowData.product_sku);
    setlookUpTableCheck(true);
  };

  const handleFetchProduct = (data) => {
    if (selectedValue === "") {
      message.warning("please select product", 3);
    } else {
      setVariantsTableCheck(true);
      setlookUpTableCheck(false);
    }
  };


  const handleCancel = () => {
    history.push({
      pathname: '/products',
    });
  };



  return (
    <div className="page product-look-up">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Product Lookup</h1>
      </div>

      <div className="page__content">
        <div className="page__form">
          <h2>Select a Product</h2>

          <div className="fetch" style={{ display: "flex" }}>
            <AutoComplete
              style={{ width: "100%" }}
              dropdownMatchSelectWidth={500}
              className="select-product-drop-down-menu"
              value={selectedValue}
              onSearch={handleSearch}
              onSelect={handleSelect}
              placeholder="select a product"
            >
              {productsSearchResult.product &&
                productsSearchResult.product.map((item) => (
                  <Option key={item.product_unique} value={item.product_unique}>
                    {item.product_name}
                  </Option>
                ))}
            </AutoComplete>

            <div className="fetch-product-row">
              <Button
                type="default"
                className="fetch-product-btn"
                icon={<ProfileOutlined />}
                onClick={() => handleFetchProduct()}
              >
                Fetch
              </Button>
            </div>
          </div>

          {variantsTableCheck && (
            <div className="table">
              {/* Insert Table Here */}
              <div className="form__section__header">
                <h3 className="variants-heading">Product Variants</h3>
              </div>
              <ProductsNestedTable
                productUniqId={selectedProduct}
                originPage={"lookup"}
                onClickFetchProductLookupData={handleFetchProductLookupData}
              />
            </div>
          )}

          {variantsTableCheck && lookUpTableCheck && (
            <div className="table">
              {/* Insert Table Here */}
              <div className="form__section__header">
                <h3 className="lookup-heading">Product Lookup Data</h3>
              </div>
              <ProductsLookUpTable productSku={selectedProductLookUpId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductLookup;
