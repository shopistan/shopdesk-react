import React, { useState, useEffect } from "react";
import "../style.scss";
import ViewStockReturnedTable from "../../../organism/table/stock/viewStockReturnedTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import { useHistory } from "react-router-dom";


import {
    Button,
    message,
    Divider,
} from "antd";

import {
    ArrowLeftOutlined, 
    DownloadOutlined,
  } from "@ant-design/icons";




const ViewStockReturn = (props) => {
    const history = useHistory();
    const [paginationLimit, ] = useState(10);
    const [loading, setLoading] = useState(true);
    const [stockReturnData, setStockReturnData] = useState([]);
    //const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { stock_return_id = {} } =  match !== undefined && match.params;


    let mounted = true;



    useEffect(() => {
        if (stock_return_id !== undefined) {
            viewStockReturnDataByReturnId(stock_return_id);
        }
        else {
            message.error("Stock Returned Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 2000);
        }


        return () => {
            mounted = false;
        }

        
    }, []);  //imp to render when history prop changes


    const viewStockReturnDataByReturnId = async (stockReturnId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const viewStockReturnDataResponse = await StockApiUtil.viewStockReturnedDataByReturnId(stockReturnId);
        console.log('viewStockReturnDataResponse:', viewStockReturnDataResponse);

        if (viewStockReturnDataResponse.hasError) {
            console.log('Cant Get Stock Returned Data -> ', viewStockReturnDataResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
            message.warning(viewStockReturnDataResponse.errorMessage, 2);
        }
        else {
            console.log('res -> ', viewStockReturnDataResponse);
            if (mounted) {     //imp if unmounted
                //message.success(viewStockReturnDataResponse.message, 3);
                setStockReturnData(viewStockReturnDataResponse.data);
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }
    }


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
        var rows = document.querySelectorAll("div#return_stock_view_data_table  tr");
    
        for (var i = 0; i < rows.length; i++) {
          var row = [],
            cols = rows[i].querySelectorAll("td, th");
    
          for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
    
          csv.push(row.join(","));
        }

        let footerRows = document.querySelectorAll("div#return_stock_view_data_table  .return-stock-view-footer");
    
        for (var i = 0; i < footerRows.length; i++) {
          var row = [],
            cols = footerRows[i].querySelectorAll("span");
    
          for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
    
          csv.push(row.join(","));
        }
    
        // Download CSV
        download_csv(csv.join("\n"), filename);
      }

    
      const DownloadToCsv = (e) => {
        if (stockReturnData.length > 0) {
          var html = document.getElementById("return_stock_view_data_table").innerHTML;
    
          export_table_to_csv(html, "GRN_" + new Date().toUTCString() + ".csv");
        } else {
          message.warning("No Return Stock Found", 3);
        }
      };


    


    const handleCancel = () => {
        history.push({
            pathname: '/stock-control/returned-stock',
            //activeKey: 'returned-stock'
        });

    };


    return (
        <div className="page stock-add">
            <div className="page__header">
                <h1><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Returned Stock</h1>


                <Button
                    type='primary'
                    className='custom-btn custom-btn--primary'
                    icon={<DownloadOutlined />}
                    onClick={DownloadToCsv}
                >
                    {" "}
                    Download
                </Button>
            </div>

            {!loading &&
                <div className="page__content">
                    <h4 className="stock-receive-details-heading">GRN</h4>

                    {/* Table */}
                    <div className='table'>
                        <ViewStockReturnedTable pageLimit={paginationLimit}
                            tableData={stockReturnData}
                            tableDataLoading={loading} 
                            tableId='return_stock_view_data_table'
                        />
                    </div>
                    {/* Table */}

                </div>
            }
        </div>
    );
};

export default ViewStockReturn;
