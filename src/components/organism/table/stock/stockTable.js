import React, { useState, useEffect } from "react";
import { Table, Form, Typography, Menu, Dropdown, Button } from "antd";
import { ProfileOutlined, DownOutlined } from "@ant-design/icons";
import { useHistory } from 'react-router-dom';
import moment from 'moment';


const StockTable = (props) => {
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const history = useHistory();


    const showActionDropDown = (record) => {
        console.log(record);

        return (
            <Dropdown overlay={() => actionMenu(record)} trigger={["click"]}>
                <Button
                    type='Default'
                    icon={<ProfileOutlined />}
                    onClick={(e) => e.preventDefault()}
                >
                    More <DownOutlined />
                    </Button>
            </Dropdown>)
    };


    const actionMenu = (record) => {

        return (
            <Menu>
                <Menu.Item key='0' onClick={() => history.push({ 
                    pathname: `/stock-control/purchase-orders/${record.purchase_order_id}/receive`,
                    data: record })}
                    >
                    Receive
              </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='1' onClick={() => history.push({ pathname: "/setup/users/add" })}>
                    Force Close
              </Menu.Item>
                <Menu.Divider />
            </Menu>
            )
    }



    useEffect(() => {
        setData(props.tableData);
        if (props.paginationData && (currentPageNumber > Math.ceil(props.paginationData.totalPages))) {
            setcurrentPageNumber(1);
        }

    }, [props.tableData, props.tableDataLoading, props.paginationData, props.tableType]);  /* imp passing props to re-render */



    const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`
    };
    
    const handlePageChange = (page, pageSize) => {
        setcurrentPageNumber(page)
        props.onClickPageChanger(page);
    };
    
    
    
    var columns;

    
    if (props.tableType === 'inventory_transfers') {

        columns = [
            {
                title: "Name",
                dataIndex: "transfer_name",
            },
            {
                title: "Source outlet",
                dataIndex: "from_store",
            },
            {
                title: "Destination outlet",
                dataIndex: "to_store",
            },
            {
                title: "Sent date",
                dataIndex: 'transfer_date',
                render: (_, record) => {
                    return (
                      <span> { moment(record.transfer_date).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Received date",
                dataIndex: 'transfer_date_received',
                render: (_, record) => {
                    return (
                      <span> { moment(record.transfer_date_received).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Status",
                dataIndex: 'transfer_status',
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.transfer_status === '0'
                                    ? "Completed"
                                    : record.transfer_status === '2' ? "Force closed"
                                        : "Open"
                                }
                            </span>
                        </div>
                    );
                },
            },
            {
                title: "Action",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.transfer_status === '0'
                                    ? "-"
                                    : record.transfer_status === '2' ? "-"
                                    : record.transfer_from === props.currentStoreId ? "-"
                                    : showActionDropDown(record)
                                }
                            </span>
                        </div>
                    );
                },
            },
           
        ];

    } 


    if (props.tableType === 'stock_adjustments') {

        columns = [
            {
                title: "Product",
                //dataIndex: "transfer_name",
            },
            {
                title: "Date",
                //dataIndex: "from_store",
            },
            {
                title: "Reason",
                ///dataIndex: "to_store",
            },
            {
                title: "Quantity",
                //dataIndex: 'transfer_date',
            },
           
        ];

    } 


    if (props.tableType === 'purchase_orders') {

        columns = [
            {
                title: "PO #",
                dataIndex: "purchase_order_show_id",
            },
            {
                title: "Name",
                dataIndex: "purchase_order_name",
            },
            {
                title: "Ordered date",
                dataIndex: "purchase_order_order_datetime",
                render: (_, record) => {
                    return (
                      <span> { moment(record.purchase_order_order_datetime).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Due date",
                dataIndex: "purchase_order_delivery_datetime",
                render: (_, record) => {
                    return (
                      <span> { moment(record.purchase_order_delivery_datetime).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Supplier",
                dataIndex: "supplier_name",
            },
            {
                title: "Status",
                dataIndex: "purchase_order_status",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.purchase_order_status === '0'
                                    ? 'Completed'
                                    : record.purchase_order_status === '2' ? "Force closed"
                                        : "Open"
                                }
                            </span>
                        </div>
                    );
                },
            },
            {
                title: "Action",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.purchase_order_status === '0'
                                    ? '-'
                                    : record.purchase_order_status === '2' ? "-"
                                    : record.purchase_order_status === '1' ? showActionDropDown(record)
                                    : '-'
                                }
                            </span>
                        </div>
                    );
                },
            },
        ];

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
        <Table
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName='editable-row'
            className='table-frame'
            pagination={{
                total: props.paginationData && props.paginationData.totalElements,
                showTotal: (total, range) => showTotalItemsBar(total, range),
                defaultPageSize: 10,
                pageSize: parseInt(props.pageLimit),
                showSizeChanger: false,
                current: currentPageNumber,
                onChange: (page, pageSize) => handlePageChange(page, pageSize),
            }}
            loading={props.tableDataLoading}
            rowKey={props.tableType === "purchase_orders" ? "purchase_order_id" : props.tableType === "users" ? "user_id" : "template_id"}
        />

    );
};

export default StockTable;

