import React, { useState, useEffect } from "react";
import { Table, Form, Typography } from "antd";
import { useHistory } from 'react-router-dom';


const SetupTable = (props) => {
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const history = useHistory();


    const handleDelete = (record) => {
        if (props.tableType === 'outlets') {
            history.push({
                pathname: `/setup/outlets/${record.store_id}/delete`,
                data: record // your data array of objects
            });
        }
        if (props.tableType === 'users') {
            history.push({
                pathname: `/setup/users/${record.user_id}/delete`,
                data: record // your data array of objects
            });
        }
        if (props.tableType === 'receipts') {
            history.push({
                pathname: `/setup/receipts-templates/${record.template_id}/delete`,
                data: record // your data array of objects
            });
        }


    };

    const edit = (record) => {
        if (props.tableType === 'outlets') {
            history.push({
                pathname: `/setup/outlets/${record.store_id}/edit`,
                data: record // your data array of objects
            });
        }
        if (props.tableType === 'users') {
            history.push({
                pathname: `/setup/users/${record.user_id}/edit`,
                data: record // your data array of objects
            });
        }
        if (props.tableType === 'receipts') {
            history.push({
                pathname: `/setup/receipts-templates/${record.template_id}/edit`,
                data: record, // your data array of objects
            });
        }

    };

    const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`
    };

    const handlePageChange = (page, pageSize) => {
        setcurrentPageNumber(page)
        props.onClickPageChanger(page);
    };


    useEffect(() => {
        setData(props.tableData);
        if ( props.paginationData && (currentPageNumber > Math.ceil(props.paginationData.totalPages))) {
            setcurrentPageNumber(1);
        }

    }, [props.tableData, props.tableDataLoading, props.paginationData, props.tableType]);  /* imp passing props to re-render */


    var columns;


    if (props.tableType === 'outlets' || props.tableType === 'receipts') {

        columns = [
            {
                title: "Name",
                dataIndex: props.tableType === 'outlets' ? 'store_name' : 'template_name',
            },
            {
                title: "Operation",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <Typography.Link
                                onClick={() => edit(record)}
                            >
                                Edit
                            </Typography.Link>

                            {props.tableType === 'receipts' &&
                                <Typography.Link
                                    onClick={() => handleDelete(record)}
                                >
                                    Delete
                            </Typography.Link>}
                        </div>
                    );

                },
            },
        ];

    }


    if (props.tableType === 'users') {

        columns = [
            {
                title: "Name",
                dataIndex: "user_name",
            },
            {
                title: "Username",
                dataIndex: "user_email",
            },
            {
                title: "Phone No.",
                dataIndex: "user_phone",
            },
            {
                title: "Role",
                dataIndex: "user_role",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.user_role === '1' 
                                  ? 'Admin'
                                  : record.user_role === '2' ? "Manager"
                                  : record.user_role === '3' ? "Cashier"
                                  : ""
                                }
                            </span>
                        </div>
                    );
                },
            },
            {
                title: "Operation",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <Typography.Link
                                onClick={() => edit(record)}
                            >
                                Edit
                            </Typography.Link>

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
            rowKey={props.tableType === "outlets" ? "store_id" : props.tableType === "users" ? "user_id" : "template_id"}
        />

    );
};

export default SetupTable;

