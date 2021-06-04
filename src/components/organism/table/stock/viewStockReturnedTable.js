
import React, { useState, useEffect, } from "react";
import { Table, Form, Row, Col } from "antd";
import "./style.scss"


const ViewStockReturnedTable = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);



    const calculateTotalStockRetunedQuantity = (data) => {
        var stockReturnedTotal = 0;
        const newData = [...data];
        newData.forEach(item => {
            stockReturnedTotal = (stockReturnedTotal + item.return_junction_quantity);
        });
        setProductsTotalAmount(stockReturnedTotal);
    }



    useEffect(async () => {
        setData(props.tableData);
        console.log("pro-table-data", props.tableData);
        calculateTotalStockRetunedQuantity(props.tableData);


    }, [props.tableData, props.tableDataLoading]);  /* imp passing props to re-render */


    var columns = null;


    
        columns = [
            {
                title: "SKU",
                dataIndex: "product_sku",
            },
            {
                title: "Qty",
                dataIndex: "return_junction_quantity",
            },
        ];



    const tableFooter = () => {
        return (
            <Row className="return-stock-view-footer">
                <Col xs={24} sm={24} md={12} >
                    <span> Total Quantity </span>
                </Col>
                <Col xs={24} sm={24} md={12} >
                    <span> {parseInt(productsTotalAmount && productsTotalAmount)} </span>
                </Col>
            </Row>
        )
    }



    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
            
            }),
        };
    });


    return (
        <Form form={form} component={false}>

            <Table
                bordered={true}
                columns={mergedColumns}
                dataSource={data}
                id={props.tableId} //imp to pass table id here
                rowClassName='editable-row'
                //loading={props.tableDataLoading}
                rowKey="product_id"
                footer={tableFooter}
                size="small"
            />


        </Form>

    );
};

export default ViewStockReturnedTable;

