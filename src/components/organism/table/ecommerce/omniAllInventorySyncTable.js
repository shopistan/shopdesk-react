
import React, { useState, useEffect } from "react";
import "./ecommerceStyle.scss";
import { Table, Form, } from "antd";
import { useHistory } from 'react-router-dom';
import moment from 'moment';



const OmniAllInventorySyncTable = (props) => {
    const history = useHistory();
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);




    useEffect(async () => {
        setData(props.tableData);

    }, [props.tableData, props.tableDataLoading, props.paginationData]);  /* imp passing props to re-render */


    const showTotalItemsBar = (total, range) => {
        console.log(range);
        return `${range[0]}-${range[1]} of ${total} items`;
    };

    const handlePageChange = (page, pageSize) => {
        setcurrentPageNumber(page);
        props.onClickPageChanger(page);
    };



    var columns = null;


    columns = [
        {
            title: "ID",
            dataIndex: "inventory_sync_id",
        },
        {
            title: "Sync started",
            dataIndex: "inventory_sync_start_datetime",
            render: (_, record) => {
                return moment(record.inventory_sync_start_datetime).format("DD MMM, yyyy hh:mm A");
            },

        },
        {
            title: "Sync ended",
            render: (_, record) => {
                return (
                    <span className="ecommerce-sale-order">
                        True
                    </span>
                );
            },

        },
        {
            title: "Status",
            render: (_, record) => {
                return (
                    <span className="ecommerce-sale-order-completed">
                        Completed
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
                loading={props.tableDataLoading}
                rowKey="product_sku"
                pagination={{
                    total: props.paginationData && props.paginationData.totalElements,
                    showTotal: (total, range) => showTotalItemsBar(total, range),
                    defaultPageSize: 25,
                    pageSize: parseInt(props.pageLimit),
                    showSizeChanger: false,
                    current: currentPageNumber,
                    onChange: (page, pageSize) => handlePageChange(page, pageSize),
                }}

            />
        </Form>

    );
};

export default OmniAllInventorySyncTable;

