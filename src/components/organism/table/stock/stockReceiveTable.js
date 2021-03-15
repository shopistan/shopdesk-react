
import React, { useState, useEffect, useContext, useRef } from "react";
import { Table, Input, Form, InputNumber, Row, Col } from "antd";
import "./style.scss";


const EditableContext = React.createContext(null);


/*------edittableRow------*/
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};


/*------edittablecell------*/

const EditableCell = ({
    record,
    dataIndex,
    title,
    handleSave,
    inputType,
    editable,
    children,
    ...restProps
}) => {

    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);


    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);


    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };


    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };


    const inputNode = inputType === 'number' ?
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
        : <Input ref={inputRef} onPressEnter={save} onBlur={save} />;


    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
            >
                {inputNode}

            </Form.Item>
        ) : (
                <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};

/*------edittablecell------*/


const StockReceiveTable = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);



    const handleSave = (row) => {
        var productsTotal = 0;
        var productsTotalQuantity = 0;
        const newData = [...data];
        const index = newData.findIndex(item => row.product_id === item.product_id);

        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });

            newData.forEach(item => {
                productsTotal = productsTotal + (parseFloat(item.qty || 0) * parseFloat(item.purchase_order_junction_price));
                productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
            });
            setProductsTotalAmount(productsTotal);
            //setData(newData); //previous code imp one
            props.onChangeProductsData(newData, productsTotalQuantity);

        };
    }



    useEffect(async () => {
        setData(props.tableData);

    }, [props.tableData, props.tableDataLoading]);  /* imp passing props to re-render */


    var columns = null;


    if (props.tableType === "receive_transfers") {

        columns = [
            {
                title: "Product Name",
                dataIndex: "product_name",
            },
            {
                title: "SKU",
                dataIndex: "product_sku",
            },
            {
                title: "Quantity",
                dataIndex: "transfer_junction_quantity",
            },


        ];

    }

    if (props.tableType === "receive_purchase_orders") {

        columns = [
            {
                title: "Product Name",
                //width: "20%",
                dataIndex: "product_name",
                render: (_, record) => {
                    return (
                        <div>
                            {record.product_name &&
                                <small>{record.product_name + '/' + record.product_variant1_value + '/ ' + record.product_variant2_value}</small>
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
                title: "Quantity ordered",
                dataIndex: "purchase_order_junction_quantity",
            },
            {
                title: "Ordered received",
                dataIndex: "qty",
                editable: true,
                render: (_, record) => {
                    return (
                        <div>
                            <InputNumber value={record.qty || 0} />
                        </div>
                    );
                }
            },
            {
                title: "Price",
                dataIndex: "purchase_order_junction_price",
            },
            {
                title: "Total",
                render: (_, record) => {
                    return (
                        <span>
                            {record.qty ? (parseFloat(record.qty) * parseFloat(record.purchase_order_junction_price)).toFixed(2)
                                : parseFloat(0)
                            }
                        </span>
                    );
                }
            },
        ];

    }





    const markAllProducts = () => {
        var productsTotal = 0;
        var productsTotalQuantity = 0;
        const newData = [...data];
        newData.forEach(item => {
            item.qty = item.purchase_order_junction_quantity;
            productsTotalQuantity = productsTotalQuantity +
                parseFloat(item.purchase_order_junction_quantity);
            productsTotal = productsTotal
                + (parseFloat(item.purchase_order_junction_quantity)
                    * parseFloat(item.purchase_order_junction_price));

        });

        setProductsTotalAmount(productsTotal);
        //setData(newData);  //imp
        props.onChangeProductsData(newData, productsTotalQuantity);

    }


    const tableFooter = () => {
        return (
            <Row style={{ textAlign: "center" }}>
                <Col xs={24} sm={24} md={6} //offset={6}
                >
                    <span>
                        <button className="btn-mark-all-products"
                            onClick={markAllProducts}
                        >
                            Mark all received
                        </button>
                    </span>
                </Col>
                <Col xs={24} sm={24} md={6} >
                    <span> TOTAL: </span>
                </Col>
                <Col xs={24} sm={24} md={6} >
                    <span> {productsTotalAmount.toFixed(2)} </span>
                </Col>
            </Row>
        )
    }



    const components = {
        body: {
            cell: EditableCell,
            row: EditableRow,
        },
    };


    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
                inputType: col.dataIndex === 'qty' ? 'number' : 'text',
                editable: col.editable,
            }),
        };
    });


    return (
        <Form form={form} component={false}>

            {props.tableType === "receive_purchase_orders" &&
            <Table

                bordered={true}
                columns={mergedColumns}
                dataSource={data}
                rowClassName='editable-row'
                components={components}
                loading={props.tableDataLoading}
                rowKey="product_id"
                footer={tableFooter}
            />}

            {props.tableType === "receive_transfers" &&
            <Table

                bordered={true}
                columns={mergedColumns}
                dataSource={data}
                rowClassName='editable-row'
                loading={props.tableDataLoading}
                rowKey="product_id"
            />}

        </Form>

    );
};

export default StockReceiveTable;

