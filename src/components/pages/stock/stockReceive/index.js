import React, { useState, useEffect } from "react";
import "../style.scss";
import StockReceiveProductsTable from "../../../organism/table/stock/stockReceiveTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import { useHistory } from "react-router-dom";
import moment from 'moment';


import {
    Form,
    Input,
    Button,
    Select,
    message,
    Row,
    Col,
    Divider,
} from "antd";

const { Option } = Select;



const StockReceive = (props) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [poData, setPoData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);


    useEffect(() => {
        if (history.location.data === undefined) {
            history.push({
                pathname: '/stock-control/purchase-orders',
            });
        }
        else {
            receivePurchaseOrders(history.location.data.purchase_order_id);
        }

    }, [history.location.data]);  //imp to render when history prop changes


    const receivePurchaseOrders = async (purchaseOrderId) => {
        const receivePurchaseOrdersResponse = await StockApiUtil.receivePurchaseOrder(purchaseOrderId);
        console.log('receivePurchaseOrdersResponse:', receivePurchaseOrdersResponse);

        if (receivePurchaseOrdersResponse.hasError) {
            console.log('Cant fetch Purchase Order Data -> ', receivePurchaseOrdersResponse.errorMessage);
            setLoading(false);
        }
        else {
            console.log('res -> ', receivePurchaseOrdersResponse);
            message.success(receivePurchaseOrdersResponse.message, 3);
            setPoData(receivePurchaseOrdersResponse.purchase_order_info);
            setProductsData(receivePurchaseOrdersResponse.products);
            setLoading(false);
        }
    }


    const handleChangeProductsData = (productsData, productsTotalQuantity = 0) => {
        setProductsData(productsData);
        setProductsTotalQuantity(productsTotalQuantity);
    };


    const handleSaveChanges = async (e) => {
        var productsTotal = 0;
        var newData = [...productsData];
        newData.forEach(item => {
            productsTotal = productsTotal + (parseFloat(item.qty || 0) * parseFloat(item.purchase_order_junction_price));
        });

        var receivePurchaseOrderPostData = {};
        receivePurchaseOrderPostData = JSON.parse(JSON.stringify(poData));
        receivePurchaseOrderPostData.purchase_order_name =
            receivePurchaseOrderPostData.purchase_order_name + ' [Open]'
        receivePurchaseOrderPostData.products = productsData;
        receivePurchaseOrderPostData.total = (productsTotal).toFixed(2);
        receivePurchaseOrderPostData.complete = true;
        receivePurchaseOrderPostData.date = moment(new Date()).format("MM/DD/yyyy HH:mm:ss");
        delete receivePurchaseOrderPostData['purchase_order_status'];


        const hide = message.loading('Saving Changes in progress..', 0);
        const res = await StockApiUtil.addReceivePurchaseOrder(receivePurchaseOrderPostData);
        console.log('AddreceivePoResponse:', res);

        if (res.hasError) {
            console.log('Cant Add Receive Po -> ', res.errorMessage);
            message.error(res.errorMessage, 3);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', res);
            message.success(res.message, 3);
            setTimeout(hide, 1000);
            setTimeout(() => {
                history.push({
                    pathname: '/stock-control/purchase-orders',
                    activeKey: 'purchase-orders'
                });
            }, 2000);
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
                <h1>Receive  Purchase Order</h1>
            </div>

            <div className="page__content">
                <h4 className="stock-receive-details-heading">Details</h4>

                <Row gutter={16, 16} className="stock-receive-row-heading">
                    <Col xs={24} sm={24} md={12} className="stock-item-content">
                        <span> Name / reference: &nbsp; {poData.purchase_order_name} &nbsp; [Open] </span>
                    </Col>
                    <Col xs={24} sm={24} md={12} className="stock-item-content">
                        <span> Order No:  &nbsp;{poData.purchase_order_show_id} </span>
                    </Col>
                    <Col xs={24} sm={24} md={12} className="stock-item-content">
                        <span>  Ordered date: &nbsp;
                            {moment(poData.purchase_order_order_datetime).format("MM DD, yyyy")}
                        </span>
                    </Col>
                    <Col xs={24} sm={24} md={12} className="stock-item-content">
                        <span> Due date:  &nbsp;
                            {moment(poData.purchase_order_delivery_datetime).format("MM DD, yyyy")}
                        </span>
                    </Col>
                    <Col xs={24} sm={24} md={12} className="stock-item-content">
                        <span> Supplier:  &nbsp; {poData.supplier_name} </span>
                    </Col>
                </Row>

                <h4 style={{ background: "#f3f3f3", padding: "10px", borderRadius: "4px" }}>
                    Receive products
                    <label className="label-stock-count">
                        {productsTotalQuantity}</label>
                </h4>

                <Row gutter={16, 16}>
                    <Col xs={24} sm={24} md={24} className="stock-item-content">

                        {/* Table */}
                        <div className='table'>
                            <StockReceiveProductsTable pageLimit={paginationLimit}
                                tableData={productsData}
                                tableDataLoading={loading}
                                onChangeProductsData={handleChangeProductsData}
                                tableType="receive_purchase_orders" />
                        </div>
                        {/* Table */}


                    </Col>
                </Row>

                <Divider />

                <div className='form__row--footer'>
                    <Button type='secondary' onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button
                        type='primary'
                        onClick={handleSaveChanges}
                        className='custom-btn custom-btn--primary'
                    >
                        Confirm
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default StockReceive;
