import React, { useState, useEffect } from "react";
import "../style.scss";
import StockReceiveProductsTable from "../../../organism/table/stock/stockReceiveTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
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

const { Option } = Select;



const TransferIn = (props) => {
    const [form] = Form.useForm();
    const history = useHistory();
    const [paginationLimit, setPaginationLimit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [transferData, setTransferData] = useState({});
    const [productsData, setProductsData] = useState([]);


    useEffect(() => {
        if (history.location.data === undefined) {
            history.push({
                pathname: '/stock-control/inventory-transfers',
            });
        }
        else {
            receiveTransfer(history.location.data.transfer_id);
        }

    }, [history.location.data]);  //imp to render when history prop changes


    const receiveTransfer = async (transferId) => {
        const receivetransferResponse = await StockApiUtil.receiveTransfer(transferId);
        console.log('receivetransferResponse:', receivetransferResponse);

        if (receivetransferResponse.hasError) {
            console.log('Cant receive transfers Data -> ', receivetransferResponse.errorMessage);
            setLoading(false);
        }
        else {
            console.log('res -> ', receivetransferResponse);
            message.success(receivetransferResponse.message, 3);
            setTransferData(receivetransferResponse.transfer);            
            setProductsData(receivetransferResponse.products);
            setLoading(false);
        }
    }


    


    const handleSaveChanges = async (e) => {

        var receiveTransferPostData = {};
        receiveTransferPostData.status = 0;
        receiveTransferPostData.date = moment(new Date()).format("yyyy/MM/DD HH:mm:ss");;
        receiveTransferPostData.transfer_id = transferData.transfer_id;;

        const hide = message.loading('Saving Changes in progress..', 0);
        const res = await StockApiUtil.addReceiveTransfersStatus(receiveTransferPostData);
        console.log('receiveTransfersStatusResponse:', res);

        if (res.hasError) {
            console.log('Cant add Receive transfers status -> ', res.errorMessage);
            message.error(res.errorMessage, 3);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', res);
            message.success(res.message, 3);
            setTimeout(hide, 1000);
            setTimeout(() => {
                history.push({
                    pathname: '/stock-control/inventory-transfers',
                    activeKey: 'inventory-transfers'
                });
            }, 2000);
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
            <div style={{ textAlign: "center" }}>
                {loading && <Spin size="large" tip="Loading..." />}
            </div>
            <div className="page__header">
                <h1>Transfer In</h1>
            </div>

            {!loading &&
                <div className="page__content">
                    <h4 className="stock-receive-details-heading">Details</h4>

                    <Row gutter={16, 16} className="stock-receive-row-heading">

                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            <span> Name / reference: &nbsp; {transferData.transfer_name} </span>
                        </Col>

                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            <span> Transfer date: &nbsp;
                                {moment(transferData.transfer_date).format("MM DD, yyyy")}
                             </span>
                        </Col>
                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            <span>  Source oulet: &nbsp;
                                {transferData.from_store}
                            </span>
                        </Col>
                       
                    </Row>

                    <h4  className="stock-receive-products-heading">
                        Receive products
                    </h4>

                    <Row gutter={16, 16}>
                        <Col xs={24} sm={24} md={24} className="stock-item-content">
                            {/* Table */}
                            <div className='table'>
                                <StockReceiveProductsTable pageLimit={paginationLimit}
                                    tableData={productsData}
                                    tableDataLoading={loading}
                                    tableType="receive_transfers" />
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
                            Receive
                    </Button>
                    </div>

                </div>
            }
        </div>
    );
};

export default TransferIn;
