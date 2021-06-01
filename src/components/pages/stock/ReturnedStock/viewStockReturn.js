import React, { useState, useEffect } from "react";
import "../style.scss";
import ViewStockReturnedTable from "../../../organism/table/stock/stockReceiveTable";
import * as StockApiUtil from '../../../../utils/api/stock-api-utils';
import { useHistory } from "react-router-dom";


import {
    Form,
    Button,
    Select,
    message,
    Divider,
} from "antd";

import {
    ArrowLeftOutlined,
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
            }, 1000);
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
            message.warning(viewStockReturnDataResponse.errorMessage, 3);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
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
            </div>

            {!loading &&
                <div className="page__content">
                    <h4 className="stock-receive-details-heading">GRN</h4>

                    {/* Table */}
                    <div className='table'>
                        <ViewStockReturnedTable pageLimit={paginationLimit}
                            tableData={stockReturnData}
                            tableDataLoading={loading}
                        />
                    </div>
                    {/* Table */}

                </div>
            }
        </div>
    );
};

export default ViewStockReturn;
