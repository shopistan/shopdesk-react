
import React, { useState, useEffect } from "react";
import "./sellHistory.scss";
import { Table, Form } from "antd";
import { HistoryOutlined, RollbackOutlined, EyeOutlined } from "@ant-design/icons";
import { useHistory } from 'react-router-dom';
import moment from 'moment';



const SellHistoryProductsTable = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);


    const handleInvoiceView = (record) => {
        props.onInvoiceSelection(record);

    };


    const handleInvoiceQuickView = (record) => { 
        props.onInvoiceQuickViewSelection(record);

    };


    useEffect(async () => {
        setData(props.tableData);
        if (props.paginationData && (currentPageNumber > Math.ceil(props.paginationData.totalPages))) {
            setcurrentPageNumber(1);
        }

    }, [props.tableData, props.tableDataLoading, props.paginationData, props.registerProcessReturn]);  /* imp passing props to re-render */


    /*const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`
    };

    const handlePageChange = (page, pageSize) => {
        setcurrentPageNumber(page)
        props.onClickPageChanger(page);
    };*/


    var columns = null;


    columns = [
        {
            title: "Date",
            dataIndex: "invoice_datetime",
            editable: true,
            render: (_, record) => {
                return (
                    <span> { moment(record.invoice_datetime).format("DD MMM, yyyy")} </span>
                );
            },
        },
        {
            title: "Receipt",
            dataIndex: "invoice_show_id",

        },
        {
            title: "Sold by",
            dataIndex: "user_name",
            editable: true,
        },
        {
            title: "Sale Total",
            render: (_, record) => {
                let tot =
                    parseFloat(record.sale_total) +
                    parseFloat(record.tax_total);

                return (
                    <div>
                        { tot.toFixed(2)}
                    </div>
                );
            }
        },
        {
            title: "Discounted Amount",
            render: (_, record) => {
                return (
                    <div>
                        { parseFloat(record.discounted_amount).toFixed(2)}
                    </div>
                );
            }
        },
        {
            title: "Invoice Note",
            dataIndex: "invoice_note",
        },
        {
            title: "Mop",
            dataIndex: "invoice_method",
            render: (_, record) => {
                return (
                    <span>
                        {record.invoice_method}
                    </span>
                );
            },

        },
        {
            title: "Status",
            render: (_, record) => {
                return (
                    <span>
                        {(record.invoice_status === "1" && record.is_dead === "0") ? "Parked"
                            : (record.invoice_status === "1" && record.is_dead === "1") ? "Dead"
                            : (record.invoice_status === "0" && record.is_returned === "0")  ? "Completed"
                            : (record.invoice_status === "0" && record.is_returned === "1")  ? "Return, completed"
                            : (record.invoice_status === "2" && record.is_returned === "0")  && "Return, completed"
                        }
                    </span>
                );
            },
        },
        {
            title: "Return", 
            render: (_, record) => {
                return (
                    <div className='action-btns stock-table-delete-item'>
                        {(record.invoice_status === "0" && record.is_returned === "0"  && props.registerProcessReturn) ? <HistoryOutlined
                            onClick={() => handleInvoiceView(record)}
                            className="sell-history-action-btn-return"
                        />
                            : (record.invoice_status === "1"  && record.is_dead === "0") ? <RollbackOutlined
                                onClick={() => handleInvoiceView(record)}
                                className="sell-history-action-btn-parked"
                            />
                                : "-"
                        }
                    </div>
                );
            },
        },
    ];


    if (props.tableType === "process-returns" || props.tableType === "all-sales") {
        let item = {
            title: "Quick View",
            render: (_, record) => {
                return (
                    <div className='action-btns stock-table-delete-item'>
                        {(record.invoice_status === "0" || record.invoice_status === "2") && <EyeOutlined
                            onClick={() => handleInvoiceQuickView(record)}
                            className="sell-history-action-btn-quick-view"
                        />}
                    </div>
                );
            },
        };

        columns.push(item);
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
                inputtype: col.dataIndex === 'qty' ? 'number' : 'text',
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
                /*pagination={{
                    total: props.paginationData && props.paginationData.totalElements,
                    showTotal: (total, range) => showTotalItemsBar(total, range),
                    defaultPageSize: 20,
                    pageSize: parseInt(props.pageLimit),
                    showSizeChanger: false,
                    current: currentPageNumber,
                    onChange: (page, pageSize) => handlePageChange(page, pageSize),
                }}*/

            />
        </Form>

    );
};

export default SellHistoryProductsTable;

