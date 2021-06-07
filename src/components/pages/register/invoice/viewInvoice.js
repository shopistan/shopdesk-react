import React, { useState, useEffect } from "react";
import InvoiceViewTable from "../../../organism/table/sell/invoiceView";
import * as SalesApiUtil from '../../../../utils/api/sales-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import {
    getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";

import Constants from "../../../../utils/constants/constants";



import {
    Form,
    Button,
    Select,
    message,
    Row,
    Col,
    Divider,
} from "antd";



const ViewInvoice = (props) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const { match = {} } = props;
    const { invoice_id = null } = match.params;

    const [loading, setLoading] = useState(true);
    const [localStorageData, setLocalStorageData] = useState(null);
    const [selectedInvoiceData, setSelectedInvoiceData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState(null);


    useEffect(() => {

        /*-----------set user store------------*/
        var readFromLocalStorage = getDataFromLocalStorage(
            Constants.USER_DETAILS_KEY
        );
        readFromLocalStorage = readFromLocalStorage.data
            ? readFromLocalStorage.data
            : null;

        setLocalStorageData(readFromLocalStorage);

        /*-----------set user store------------*/
        getSelectedInvoiceHistory(invoice_id)

    }, []);  //imp to render when history prop changes


    const getSelectedInvoiceHistory = async (invoiceId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getSaleHistoryResponse = await SalesApiUtil.getSalesInvoiceHistory(invoiceId);
        console.log('getSaleHistoryResponse:', getSaleHistoryResponse);

        if (getSaleHistoryResponse.hasError) {
            console.log('Cant fetch registered products Data -> ', getSaleHistoryResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            message.warning(getSaleHistoryResponse.errorMessage, 3);
            setLoading(false);
        }
        else {
            console.log('res -> ', getSaleHistoryResponse);
            document.getElementById('app-loader-container').style.display = "none";
            message.success(getSaleHistoryResponse.message, 2);
            setSelectedInvoiceData(getSaleHistoryResponse.invoices);
            setCustomerData(getSaleHistoryResponse.customer);
            setInvoiceDetails(getSaleHistoryResponse.invoice_details);
            setLoading(false);

        }
    }


    const handleCancel = () => {
        history.goBack();
    };


    return (
        <div className="page stock-add">

            {!loading &&
            <div className="page__header">
                <h1><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Invoice # {invoiceDetails.invoice_show_id}</h1>
            </div>}

            {!loading &&
                <div className="page__content">
                    <h4 className="stock-receive-details-heading">customer</h4>

                    <Row gutter={16, 16} className="stock-receive-row-heading">
                        <Col xs={24} sm={24} md={12} className="stock-item-content">
                            <span> Name: &nbsp; {customerData.customer_name} </span>
                        </Col>
                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            <span> Email:  &nbsp;{customerData.customer_email} </span>
                        </Col>
                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            <span> Phone:  &nbsp;{customerData.customer_phone} </span>
                        </Col>

                    </Row>

                    <h4 className="stock-receive-products-heading">
                        Products
                    <label className="label-stock-count">
                            {selectedInvoiceData.length}</label>
                    </h4>

                    <Row gutter={16, 16}>
                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            {/* Table */}
                            <div className='table'>
                                <InvoiceViewTable
                                    tableData={selectedInvoiceData}
                                    tableDataLoading={loading}
                                    userCurrency={localStorageData.currency}
                                />
                            </div>
                            {/* Table */}
                        </Col>
                    </Row>
                    <Divider />


                </div>
            }
        </div>
    );
};

export default ViewInvoice;
