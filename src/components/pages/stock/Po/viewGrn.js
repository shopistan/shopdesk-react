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





const PurchaseOrderViewGrn = (props) => {
    const history = useHistory();
    const [stockPoViewGrnData, setStockPoViewGrnData] = useState([]);
    const { match = {} } = props;
    const { po_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect(() => {
        if (po_id !== undefined) {
            fetchPurchaseOrdersViewGrn(po_id);
        }
        else {
            message.error("Stock PO Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 2000);
        }


        return () => {
            mounted = false;
        }


    }, []);  //imp to render when history prop changes


    const fetchPurchaseOrdersViewGrn = async (PurchaseOrderId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const viewStockPoGrnDataResponse = await StockApiUtil.viewStockPurchaseOrdersViewGrnByPoId(PurchaseOrderId);
        console.log('viewStockPoGrnDataResponse:', viewStockPoGrnDataResponse);

        if (viewStockPoGrnDataResponse.hasError) {
            console.log('Cant Get Stock Returned Data -> ', viewStockPoGrnDataResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            message.warning(viewStockPoGrnDataResponse.errorMessage, 2);
        }
        else {
            if (mounted) {     //imp if unmounted
                setStockPoViewGrnData(viewStockPoGrnDataResponse.data);
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
        var rows = document.querySelectorAll("div#purchase_order_view_grn_table  tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [],
                cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        let footerRows = document.querySelectorAll("div#purchase_order_view_grn_table  .po-view-grn-view-footer");

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
        if (stockPoViewGrnData.length > 0) {
            var html = document.getElementById("purchase_order_view_grn_table").innerHTML;

            export_table_to_csv(html, "PO_GRN_" + new Date().toUTCString() + ".csv");
        } else {
            message.warning("No PO View Grn Found", 3);
        }
    };


    const handleCancel = () => {
        history.push({
            pathname: '/stock-control/purchase-orders',
            activeKey: 'purchase-orders'
        });

    };


    return (
        <div className="page stock-add">

            <div className="page__header">
                <h1><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />GRN View</h1>

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
                        tableData={stockPoViewGrnData}
                        tableId='purchase_order_view_grn_table'
                    />
                </div>
                {/* Table */}
            </div>

        </div>
    );
};

export default PurchaseOrderViewGrn;
