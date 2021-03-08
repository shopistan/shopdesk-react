import React, { useState, useEffect } from "react";
import "../style.scss";

import { Button, message, Divider } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ProductsInventoryTable from "../../../organism/table/reports/productsInventoryTable";
import * as ReportsApiUtil from '../../../../utils/api/reports-api-utils';

const InventoryDump = () => {
  const [inventoryCount, SetinventoryCount] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchProductsInventoryData = async () => {

    const productsInventoryResponse = await ReportsApiUtil.viewPrductsInventory();
    console.log('productsInventoryResponse Response:', productsInventoryResponse);

    if (productsInventoryResponse.hasError) {
      console.log('Cant fetch Products Inventory Data -> ', productsInventoryResponse.errorMessage);
      message.error(productsInventoryResponse.errorMessage, 3);
      setLoading(false);
    }
    else {
      console.log('res -> ', productsInventoryResponse);
      message.success(productsInventoryResponse.message, 3);
      setInventoryData(productsInventoryResponse.inventory_report);
      setLoading(false);
      SetinventoryCount((productsInventoryResponse.inventory_report).length);


    }
  }



  useEffect(() => {
    fetchProductsInventoryData();

  }, []);



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
    var rows = document.querySelectorAll("div#products_inventory_data_table tr");

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

    if (inventoryData.length > 0) {
      var html = document.getElementById('products_inventory_data_table').innerHTML;

      export_table_to_csv(html, "sales_summary.csv");

    }
    else { message.error("No Sales Data Found", 3) }

  }



  return (
    <div className='page reports-inventory'>
      <div className='page__header'>
        <h1>Inventory Dump</h1>

        <Button type='primary'
          icon={<DownloadOutlined />}
          onClick={DownloadToCsv}
        >
          Download
        </Button>
      </div>

      <div className='page__content'>
        <div className='action-row'>
          <strong className="inventory-count-badge">Total: {inventoryCount}</strong>
        </div>

        <div className='table inventory-table'>{/* Insert Table Here */}
          <div className='form__section__header'>
            <h3 className='variants-heading'>Inventory Dump</h3>
          </div>
          
          <ProductsInventoryTable tableId='products_inventory_data_table' pageLimit={20} tableData={inventoryData}
            tableDataLoading={loading} />
        </div>

      </div>

    </div>

  );
};

export default InventoryDump;
