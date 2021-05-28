
import React, { useState, useEffect } from "react";
//import "./style.scss";
import { Table, Form, InputNumber, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useHistory } from 'react-router-dom';



const SellNestedQuickViewProductsTable = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);




    useEffect(async () => {
        setData(props.tableData);
        console.log("pro", props.tableData);
       

    }, [props.tableData, props.tableDataLoading ]);  /* imp passing props to re-render */


    const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`
    };


    var columns = null;


    columns = [
        {
            title: "Product Name",
            //width: "20%",
            dataIndex: "product_name",
            render: (_, record) => {
                return (
                    <div>
                        {record.product_name &&
                            record.product_variant1_value ? record.product_variant2_value ? <small>{record.product_name + '/ ' + record.product_variant1_value + '/ ' + record.product_variant2_value}</small>
                                : <small>{record.product_name + ' / ' + record.product_variant1_value}</small>
                            : record.product_variant2_value ? <small>{record.product_name + ' / ' + record.product_variant2_value}</small>
                                : record.product_name
                        }
                    </div>
                );
            }

        },
        {
            title: "SKU",
            dataIndex: "product_sku",
        },
        {
            title: "QTY",
            dataIndex: "qty",
            //editable: true,
            render: (_, record) => {
                return (
                    <div>
                        {parseFloat(record.qty) >= 0 ? parseFloat(record.qty) : (parseFloat(record.qty) * -1) }
                    </div>
                );
            }
        },
        {
            title: "Sale Price",
            dataIndex: "product_sale_price",
            //editable: true,
            render: (_, record) => {
                return (
                    <div>
                        {parseFloat(record.product_sale_price).toFixed(2)}
                    </div>
                );
            }
        },
        {
            title: "Total",
            render: (_, record) => {
                let productQty = parseFloat(record.qty) >= 0 ? parseFloat(record.qty) : (parseFloat(record.qty) * -1);
                return (
                    <div>
                        {record.qty ? (productQty * parseFloat(record.product_sale_price)).toFixed(2)
                            : parseFloat(0)
                        }
                    </div>
                );
            }
        },
    ];




    const tableFooter = () => {
        return (
            <Row style={{ textAlign: "center" }}>
                <Col xs={24} sm={24} md={6} offset={12}>
                    <span> TOTAL: </span>
                </Col>
                <Col xs={24} sm={24} md={6} >
                    <span> {productsTotalAmount.toFixed(2)} </span>
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
                rowClassName='editable-row'
                loading={props.tableDataLoading}
                rowKey="product_id"
                pagination={{
                    total: props.tableData && props.tableData.length,
                    showTotal: (total, range) => showTotalItemsBar(total, range),
                    defaultPageSize: 20,
                    //pageSize: parseInt(props.pageLimit),
                    showSizeChanger: true,
                    //current: currentPageNumber,
                    //onChange: (page, pageSize) => handlePageChange(page, pageSize),
                }}
            //footer={tableFooter}
            //size="small"
            />
        </Form>

    );
};

export default SellNestedQuickViewProductsTable;

