import React, { useState, useEffect } from "react";
import "../style.scss";
import PurchaseOrderviewGrnTable from "../../../organism/table/stock/PurchaseOrderviewGrnTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import { useHistory } from "react-router-dom";

import {
    Button,
    message,
} from "antd";

import {
    ArrowLeftOutlined,
    DownloadOutlined,
} from "@ant-design/icons";





const TransferViewGrn = (props) => {
    const history = useHistory();
    const [stockTransfersViewGrnData, setStockTransfersViewGrnData] = useState([]);
    const { match = {} } = props;
    const { transfer_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect(() => {
        if (transfer_id !== undefined) {
            fetchStockTransfersViewGrn(transfer_id);
        }
        else {
            message.error("Stock Transfer Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 2000);
        }


        return () => {
            mounted = false;
        }


    }, []);  //imp to render when history prop changes


    const fetchStockTransfersViewGrn = async (transferId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const viewTransfersGrnDataResponse = await StockApiUtil.viewStockTransfersViewGrnByTransferId(transferId);
        console.log('viewStockPoGrnDataResponse:', viewTransfersGrnDataResponse);

        if (viewTransfersGrnDataResponse.hasError) {
            console.log('Cant Get Stock Returned Data -> ', viewTransfersGrnDataResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            message.warning(viewTransfersGrnDataResponse.errorMessage, 2);
        }
        else {
            if (mounted) {     //imp if unmounted
                setStockTransfersViewGrnData(viewTransfersGrnDataResponse.data);
                document.getElementById('app-loader-container').style.display = "none";
                //message.success(viewStockReturnDataResponse.message, 3);
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
        var rows = document.querySelectorAll("div#transfers_view_grn_table tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [],
                cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        let footerRows = document.querySelectorAll("div#transfers_view_grn_table  .transfers-view-grn-view-footer");

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
        if (stockTransfersViewGrnData.length > 0) {
            var html = document.getElementById("transfers_view_grn_table").innerHTML;

            export_table_to_csv(html, "TRANSFERS_GRN_" + new Date().toUTCString() + ".csv");
        } else {
            message.warning("No Transfers View Grn Found", 3);
        }
    };


    const handleCancel = () => {
        history.push({
            pathname: '/stock-control/inventory-transfers',
            activeKey: 'inventory-transfers'
        });

    };


    return (
        <div className="page stock-add">

            <div className="page__header">
                <h1><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Transfers View</h1>

                <Button type='primary'
                    className='custom-btn custom-btn--primary'
                    icon={<DownloadOutlined />}
                    onClick={DownloadToCsv}
                >
                    Export CSV
                </Button>
            </div>

            <div className="page__content">
                <h4 className="stock-receive-details-heading">GRN</h4>
                {/* Table */}
                <div className='table'>
                    <PurchaseOrderviewGrnTable
                        tableData={stockTransfersViewGrnData}
                        tableId='transfers_view_grn_table'
                        tableType='transfers'
                    />
                </div>
                {/* Table */}
            </div>

        </div>
    );
};

export default TransferViewGrn;
