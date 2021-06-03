import React, { useState, useEffect } from "react";
import "../style.scss";
import StockReceiveProductsTable from "../../../organism/table/stock/stockReceiveTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import Constants from '../../../../utils/constants/constants';
import {
  getDataFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import { useHistory } from "react-router-dom";
import moment from 'moment';


import {
    Form,
    Spin,
    Button,
    Select,
    message,
    Row,
    Col,
    Divider,
} from "antd";

import {
    ArrowLeftOutlined,
  } from "@ant-design/icons";

const { Option } = Select;



const StockReceive = (props) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [poData, setPoData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [productsTotalQuantity, setProductsTotalQuantity] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [userLocalStorageData, setUserLocalStorageData] = useState(null);
    const { match = {} } = props;
    const { po_id = {} } =  match !== undefined && match.params;

    var mounted = true;




    useEffect(() => {
        if (po_id !== undefined) {
            receivePurchaseOrders(po_id);
        }
        else {
            message.error("Puchase Oder Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

        /*--------------set user local data-------------------------------*/
        var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
        readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
        setUserLocalStorageData(readFromLocalStorage);
        /*--------------set user local data-------------------------------*/

        return () => {
            mounted = false;
        }

    }, []);  //imp to render when history prop changes


    const receivePurchaseOrders = async (purchaseOrderId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const receivePurchaseOrdersResponse = await StockApiUtil.receivePurchaseOrder(purchaseOrderId);
        console.log('receivePurchaseOrdersResponse:', receivePurchaseOrdersResponse);

        if (receivePurchaseOrdersResponse.hasError) {
            console.log('Cant fetch Purchase Order Data -> ', receivePurchaseOrdersResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', receivePurchaseOrdersResponse);
            if (mounted) {     //imp if unmounted
                message.success(receivePurchaseOrdersResponse.message, 3);
                setPoData(receivePurchaseOrdersResponse.purchase_order_info);
                var receiveProducts = [...receivePurchaseOrdersResponse.products];
                receiveProducts.forEach((item,) => {
                    item.qty = 0;
                })
                setProductsData(receiveProducts);
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
            }
            
        }
    }


    const handleChangeProductsData = (productsData, productsTotalQuantity = 0, editReceiveProductValidationCheck = false) => {
        if (editReceiveProductValidationCheck) {   //imp to disable upon wrong valiadation
            message.warning("received quantity can't be negative or more than the ordered quantity ", 4);
            setProductsData(productsData);  //imp to set products data
            setProductsTotalQuantity(productsTotalQuantity);   //imp
            setReeiveButtonDisableCheck(productsData);
        }
        else {
            setProductsData(productsData);
            setProductsTotalQuantity(productsTotalQuantity);
            setReeiveButtonDisableCheck(productsData);
        }

    };


    const setReeiveButtonDisableCheck = (productsData) => {
        let saveButtonDisableCheck = false;
        productsData.forEach(item => {
            if((item.qty > item.purchase_order_junction_quantity) || (item.qty < 0)) { 
                saveButtonDisableCheck = true; 
            }
        });

        if(saveButtonDisableCheck){
            setButtonDisabled(true);
        }
        else{
            setButtonDisabled(false);
        }

    };


    const handleSaveChanges = async (e) => {
        var productsTotal = 0;
        var completeCheck = true;
        
        productsData.forEach(item => {
            productsTotal = productsTotal + (parseFloat(item.qty || 0) * parseFloat(item.purchase_order_junction_price));
            if(
                item.qty < 
                parseInt(item.purchase_order_junction_quantity)
            ) { completeCheck = false; }
        });

        var receivePurchaseOrderPostData = {};
        receivePurchaseOrderPostData = JSON.parse(JSON.stringify(poData));
        receivePurchaseOrderPostData.purchase_order_name =
            receivePurchaseOrderPostData.purchase_order_name + ' [Open]'
        receivePurchaseOrderPostData.products = productsData;
        receivePurchaseOrderPostData.total = (productsTotal).toFixed(2);
        receivePurchaseOrderPostData.complete = completeCheck;
        receivePurchaseOrderPostData.date = moment(new Date()).format("yyyy/MM/DD HH:mm:ss");
        delete receivePurchaseOrderPostData['purchase_order_status'];


        if (buttonDisabled === false) {
            setButtonDisabled(true);}
        
        document.getElementById('app-loader-container').style.display = "block";
        const res = await StockApiUtil.addReceivePurchaseOrder(receivePurchaseOrderPostData);
        console.log('AddreceivePoResponse:', res);

        if (res.hasError) {
            console.log('Cant Add Receive Po -> ', res.errorMessage);
            message.error(res.errorMessage, 3);
            document.getElementById('app-loader-container').style.display = "none";
            setButtonDisabled(false);
        }
        else {
            console.log('res -> ', res);
            if (mounted) {     //imp if unmounted
                message.success(res.message, 3);
                document.getElementById('app-loader-container').style.display = "none";
                setTimeout(() => {
                    history.push({
                        pathname: '/stock-control/purchase-orders',
                        activeKey: 'purchase-orders'
                    });
                }, 2000);
            }

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
                    onClick={handleCancel} />Receive  Purchase Order</h1>
            </div>

            {!loading &&
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

                    <h4  className="stock-receive-products-heading">
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
                                    tableType="receive_purchase_orders"
                                    currency={userLocalStorageData.currency.symbol}
                                />
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
                            disabled={buttonDisabled}
                        >
                            Confirm
                    </Button>
                    </div>

                </div>
            }
        </div>
    );
};

export default StockReceive;
