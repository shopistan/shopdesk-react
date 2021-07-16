
import React, { useState, useEffect, } from "react";
import { Table, Form, Row, Col } from "antd";
import "./style.scss"


const PurchaseOrderviewGrnTable = (props) => {
    const { tableType =  "" } = props;
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);



    const calculateTotalStockRetunedQuantity = (data) => {
        var stockReturnedTotal = 0;
        const newData = [...data];
        newData.forEach(item => {
            let itemQty = tableType === "transfers" ?
                parseFloat(item.quantity) : parseFloat(item.grn_junction_quantity);

            stockReturnedTotal = (stockReturnedTotal + itemQty);
        });
        setProductsTotalAmount(stockReturnedTotal);
    }



    useEffect(async () => {
        setData(props.tableData);
        calculateTotalStockRetunedQuantity(props.tableData);


    }, [props.tableData]);  /* imp passing props to re-render */


    let columns = null;


    if (tableType === "transfers") {
        columns = [
            {
                title: "SKU",
                dataIndex: "sku",
            },
            {
                title: "Price",
                dataIndex: "purchase_price",
            },
            {
                title: "Qty",
                dataIndex: "quantity",
            },
        ];
    }
    else {
        columns = [
            {
                title: "SKU",
                dataIndex: "product_sku",
            },
            {
                title: "Price",
                dataIndex: "grn_junction_price",
            },
            {
                title: "Qty",
                dataIndex: "grn_junction_quantity",
            },
        ];

    }



    const tableFooter = () => {
        return (
            <Row className="transfers-view-grn-view-footer">
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
                rowKey="product_id"
                footer={tableFooter}
                size="small"
                pagination={false}
            />
        </Form>

    );
};

export default PurchaseOrderviewGrnTable;

