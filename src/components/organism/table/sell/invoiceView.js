
import React, { useState, useEffect } from "react";
import { Table, Form } from "antd";
//import "./style.scss";




const InvoiceView = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [userCurrency, setUserCurrency] = useState("");


    const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`
    };


    useEffect(async () => {
        setData(props.tableData);
        setUserCurrency(props.userCurrency);

    }, [props.tableData, props.tableDataLoading]);  /* imp passing props to re-render */


    var columns = [
            {
                title: "Name",
                dataIndex: "product_name",
                render: (_, record) => {
                    return (
                        <div>
                            {record.product_name} <br/>
                            <small>({record.product_sku})</small>
                        </div>
                    );
                }
            },
            {
                title: "Quantity",
                dataIndex: "qty",
                render: (_, record) => {
                    return (
                        <div>
                            {(record.qty * (-1))}
                        </div>
                    );
                }
            },
            {
                title: "Sold Price",
                dataIndex: "product_sale_price",
                render: (_, record) => {
                    return (
                        <div>
                            {userCurrency.symbol+" "+record.product_sale_price}
                        </div>
                    );
                }
            },
            {
                title: "Tax value",
                dataIndex: "tax_value",
            },
            {
                title: "Sub-total",
                render: (_, record) => {
                    return (
                        <div>
                            {(record.qty * -1) * record.product_sale_price}
                        </div>
                    );
                }
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
                rowClassName='editable-row'
                //loading={props.tableDataLoading}
                rowKey="product_id"
                pagination={{
                    total: props.tableData && props.tableData.length,
                    showTotal: (total, range) => showTotalItemsBar(total, range),
                    defaultPageSize: 20,
                }}
            />

        </Form>

    );
};

export default InvoiceView;

