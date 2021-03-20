import React, { useState, useEffect } from "react";
import {
  ProfileOutlined,
} from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";
import { Input, AutoComplete, Select, Button, message, Divider } from "antd";
import ProductsNestedTable from "../../../organism/table/productsNestedTable/productsViewNestedTable";
import ProductMovementReportTable from "../../../organism/table/reports/productsMovementReportTable";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';


const ProductHistory = () => {
  const [productsSearchResult, setProductsSearchResult] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [variantsTableCheck, setVariantsTableCheck] = useState(false);
  const [ productMovementTableCheck,  setProductMovementTableCheck] = useState(false);
  const [ productMovementReportData,  setProductMovementReportData] = useState(null);


  const { Search } = Input;
  const { Option } = Select;


  useEffect( () => {

  }, []);


  const handleSearch = async (value) => {
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
    setVariantsTableCheck(false);  //imp to set here
  };


  const handleFetchProductMovementData = (rowData) => {
    fetchProductMovementReport(rowData.product_id);

  };



  const fetchProductMovementReport = async (productId) => {

    const hide = message.loading('Getting Product Data..', 0);
    const productMovementReportResponse = await ProductsApiUtil.getProductMovementReport(productId);
    console.log('productMovementReportResponse:', productMovementReportResponse);
    if (productMovementReportResponse.hasError) {
        console.log('Cant fetch productMovementReport Data -> ', productMovementReportResponse.errorMessage);
        setTimeout(hide, 1000);
    }
    else {
        console.log('res -> ', productMovementReportResponse);
        setTimeout(hide, 1000);
        message.success(productMovementReportResponse.message, 3);
        setProductMovementReportData(productMovementReportResponse.product_movement);
        setProductMovementTableCheck(true);
        
    }
  }



  const handleFetchProduct = (data) => {
    if (selectedValue === '') { message.warning('please select product', 3); }
    else {
      setVariantsTableCheck(true);
      setProductMovementTableCheck(false);
    }
  };



  function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  }


  function export_table_to_csv(html, filename) {
    var csv = [];
    //imp selection below
    var rows = document.querySelectorAll("div#product_movement_report_data_table  tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++)
        row.push(cols[j].innerText);

      csv.push(row.join(","));
    }

    // Download CSV
    download_csv(csv.join("\n"), filename);
  }


  const DownloadToCsv = (e) => {

    if (productMovementReportData) {
      var html = document.getElementById('product_movement_report_data_table').innerHTML;

      export_table_to_csv(html, "product_movement_report.csv");

    }
    else { message.error("No Product History Data Found", 3) }

  }





  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Product History</h1>
        <Button
            type='primary'
            icon={<DownloadOutlined />}
            onClick={DownloadToCsv}
          > Download</Button>
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
                 onClickFetchProductLookupData={handleFetchProductMovementData} />
            </div>}

          <Divider/>

          {variantsTableCheck &&  productMovementTableCheck && productMovementReportData &&
            <div className='table'>
              <div className='form__section__header'>
                <h3 className='variants-heading'>Product Info</h3>
              </div>
              <ProductMovementReportTable
               tableId='product_movement_report_data_table'
               tableData={productMovementReportData} />
            </div>}
          
          <Divider/>

        </div>
      </div>
    </div>
  );
};

export default ProductHistory;
