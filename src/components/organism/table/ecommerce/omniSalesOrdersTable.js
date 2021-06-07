
import React, { useState, useEffect } from "react";
import "./ecommerceStyle.scss";
import { Table, Form, Typography } from "antd";
import { useHistory } from 'react-router-dom';
import moment from 'moment';



const OmniSalesOrdersTable = (props) => {
    const {currency = "" } = props;
    const history = useHistory();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);



    const viewSaleOrder = (record) => {
        history.push({
            pathname: `/ecommerce/orders/${record.invoice_id}/view`,
        });
    };



    useEffect(async () => {
        setData(props.tableData);
        if (props.paginationData && (currentPageNumber > Math.ceil(props.paginationData.totalPages))) {
            setcurrentPageNumber(1);
        }

    }, [props.tableData, props.tableDataLoading, props.paginationData, props.tableType, props.currency]);  /* imp passing props to re-render */



    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            props.onSaleOrdersSelectedTableRows(selectedRowKeys, selectedRows);
        },
        getCheckboxProps: (record) => {
            const rowIndexCheck = record.invoice_status === "4" ? true : false;
            //console.log(rowIndexCheck);
            return {
                disabled: rowIndexCheck   //imp  disable if completed
            };
        }

    };




    var columns = null;


    columns = [
        {
            title: "Order ID",
            //dataIndex: "invoice_reference_id",
            //width: "30%",
            render: (_, record) => {
                return (

                    <div className='omni-sales-order-id'>
                        <Typography.Link
                            onClick={() => viewSaleOrder(record)}>
                            {record.invoice_reference_id}
                        </Typography.Link>
                    </div>

                )
            },
        },
        {
            title: "Region",
            dataIndex: "invoice_region",

        },
        {
            title: "Status",
            //dataIndex: "invoice_status",
            //width: "50%",
            render: (_, record) => {
                return (
                    <span className={record.invoice_status === "3" && 'ecommerce-sale-order' ||
                        record.invoice_status === "4" && 'ecommerce-sale-order-completed' ||
                        record.invoice_status === "5" && 'ecommerce-sale-order-canceled' ||
                        record.invoice_status === "6" && 'ecommerce-sale-order-returned'
                    }

                    >
                        {record.invoice_status === "3" ? "Sale Order"
                            : record.invoice_status === "4" ? "Completed"
                                : record.invoice_status === "5" ? "Canceled"
                                    : record.invoice_status === "6" ? "Returned"
                                        : ""

                        }
                    </span>
                );
            },
        },
        {
            title: "Dated",
            //dataIndex: "invoice_datetime",
            //width: "20%",
            render: (_, record) => {
                return moment(record.invoice_datetime).format("DD MMM, yyyy hh:mm A")
            },
        },
        {
            title: "Mop",
            dataIndex: "invoice_method",

        },
        {
            title: "Shipping Method",
            dataIndex: "invoice_shipping_method",
        },
        {
            title: "Shipping Cost",
            //dataIndex: "invoice_shipping_price",
            render: (_, record) => {
                //{currency + parseFloat(record.invoice_shipping_price).toFixed(2)}    //imp prev
                return (
                    <span>
                        {(record.invoice_currency || "") + parseFloat(record.invoice_shipping_price).toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: "Order Total",
            //dataIndex: "sale_total_currency",
            render: (_, record) => {
                return (
                    <span>
                        {(record.invoice_currency || "") + parseFloat(record.sale_total_currency).toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: "Order Total (PKRs)",
            //dataIndex: "sale_total_pkr",
            render: (_, record) => {
                return (
                    <span>
                        {(record.invoice_currency || "")  + parseFloat(record.sale_total_pkr).toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: "Discount",
            //dataIndex: "invoice_discount",
            render: (_, record) => {
                return (
                    <span>
                        {(record.invoice_currency || "")  + parseFloat(record.invoice_discount).toFixed(2)}
                    </span>
                );
            },
        },
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
                rowKey="invoice_id"
                pagination={false}
                rowSelection={{
                    ...rowSelection,
                }}

            />
        </Form>

    );
};

export default OmniSalesOrdersTable;

