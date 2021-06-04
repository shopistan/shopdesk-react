
import React, { useState, useEffect } from "react";
import "./ecommerceStyle.scss";
import { Table, Form, Typography } from "antd";
import { useHistory } from 'react-router-dom';



const OmniSalesOrdersProductsTable = (props) => {
    const {currency = "" } = props;
    const history = useHistory();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);




    useEffect(async () => {
        setData(props.tableData);

    }, [props.tableData, props.tableDataLoading, props.pageLimit]);  /* imp passing props to re-render */


    /*const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`;
    };*/



    var columns = null;


    columns = [
        {
            title: "Name",
            dataIndex: "product_name",  
            render: (_, record) => {
                return (
                    <span>
                        {record.product_name}<br/>
                         <small>{record.product_sku}</small>
                    </span>
                );
            },
        },
        {
            title: "Quantity",
            dataIndex: "invoice_junction_quantity",
            render: (_, record) => {
                return (
                    <span>
                        {record.invoice_junction_quantity}
                    </span>
                );
            },

        },
        {
            title: "Actual Price",
            dataIndex: "Invoice_junction_perfect_sale",
            render: (_, record) => {
                return (
                    <span>
                        {currency+parseFloat(record.Invoice_junction_perfect_sale).toFixed(2)}
                    </span>
                );
            },
           
        },
        {
            title: "Sold Price",
            dataIndex: "invoice_junction_sale", 
            render: (_, record) => {
                return (
                    <span>
                        {currency+parseFloat(record.invoice_junction_sale).toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: "Sub-Total",
            dataIndex: "invoice_junction_sale_total",
            render: (_, record) => {
                return (
                    <span>
                        {currency+parseFloat(record.invoice_junction_sale_total).toFixed(2)}
                    </span>
                );
            },

        },
        {
            title: "Discount",
            dataIndex: "Discount",
            render: (_, record) => {
                return (
                    <span>
                        {currency+parseFloat(record.Discount).toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: "Premium",
            dataIndex: "Premium",
            render: (_, record) => {
                return (
                    <span>
                        {currency+parseFloat(record.premium).toFixed(2)}
                    </span>
                );
            },
        }
       
        
    ];




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
                //loading={props.tableDataLoading}
                rowKey="product_sku"
                pagination={false}
                /*pagination={{
                    total: data && data.length,
                    showTotal: (total, range) => showTotalItemsBar(total, range),
                    defaultPageSize: 20,
                    pageSize: parseInt(props.pageLimit),
                    showSizeChanger: false,
                }}*/

            />
        </Form>

    );
};

export default OmniSalesOrdersProductsTable;

