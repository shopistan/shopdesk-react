
import React, { useState, useEffect, useContext, useRef } from "react";
import "./style.scss";
import { Table, Input, Form, InputNumber, Row, Col, Tooltip, } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useHistory } from 'react-router-dom';


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


    const onQuantityInputChange = (e) => {
        let orderQty = e.target.value;
        //console.log("qty", orderQty);
        const re = /^[0-9\b]+$/;
        //console.log(re.test(e.target.value));
        if (!orderQty === '' || !re.test(orderQty)) {  //if contains alphabets in string
            form.setFieldsValue({
                qty: orderQty.replace(/[^\d.]/g, '')
            });
        }

    }


    const inputNode = inputType === 'number' ?
        <Input ref={inputRef} onChange={onQuantityInputChange} onPressEnter={save} onBlur={save} />
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
                <div className="editable-cell-value-wrap"
                    //style={{ paddingRight: 24 }}
                    onClick={toggleEdit}>
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};

/*------edittablecell------*/


const StockNestedProductsTable = (props) => {
    const history = useHistory();
    const {currency = "" } = props;
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);


    const handleDelete = (record) => {
        var productsTotal = 0;
        var productsTotalQuantity = 0;

        const newData = [...data];
        const index = newData.findIndex(item => record.product_id === item.product_id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1);

            newData.forEach(item => {
                productsTotal = productsTotal + (parseFloat(item.qty || 0) * parseFloat(item.product_purchase_price));
                productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
            });

            setProductsTotalAmount(productsTotal);
            props.onChangeProductsData(newData, productsTotalQuantity);
        };

    };



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
                productsTotal = productsTotal + (parseFloat(item.qty || 0) * parseFloat(item.product_purchase_price));
                productsTotalQuantity = productsTotalQuantity + parseFloat(item.qty || 0);
            });

            setProductsTotalAmount(productsTotal);
            //setData(newData); //previous code imp one
            props.onChangeProductsData(newData, productsTotalQuantity);
        };
    }


    const calculateTotalAmount = (data) => {
        var productsTotal = 0;
        const newData = [...data];
        newData.forEach(item => {
            productsTotal = productsTotal + (parseFloat(item.qty || 0) * parseFloat(item.product_purchase_price));
        });
        setProductsTotalAmount(productsTotal);
    }



    useEffect(async () => {
        setData(props.tableData);
        calculateTotalAmount(props.tableData);

    }, [props.tableData, props.tableDataLoading,]);  /* imp passing props to re-render */


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
                            <small>
                                {
                                    record.product_name
                                    + '/' + record.product_variant1_value
                                    + '/ ' + record.product_variant2_value
                                }
                            </small>
                        }
                    </div>
                );
            }
        },
        {
            title: "SKU",
            dataIndex: "product_sku",
            render: (_, record) => {
                return (
                    <div>
                        {record.product_sku}
                    </div>
                );
            }
        },
        {
            title: "Quantity In Hand",
            dataIndex: "product_quantity",
            render: (_, record) => {
                return (
                    <div>
                        {record.product_quantity}
                    </div>
                );
            }
        },
        {
            title: props.tableType ==='order_stock' ? "Ordered quantity"
             : props.tableType ==='order_adjustment' ? "Adjusted quantity"
             : "Ordered quantity",
            dataIndex: "qty",
            editable: true,
            render: (_, record) => {
                return (
                    <div>
                        <Tooltip title={props.tableType ==='order_adjustment' && "Adjusted quantity"}>
                            <Input className='u-width-100' value={record.qty || 0} />
                        </Tooltip>
                        
                    </div>
                );
            }
        },
        {
            title: "Purchase Price",
            dataIndex: "product_purchase_price",
            render: (_, record) => {
                return (
                    <div>
                        {currency+record.product_purchase_price}
                    </div>
                );
            }
        },
        {
            title: "Sale Price",
            dataIndex: "product_sale_price",
            editable: props.tableType === 'order_stock' ? true : false,    //imp new one
            render: (_, record) => {
                return (
                    <div>
                        {currency+record.product_sale_price}
                    </div>
                );
            }
        },
        {
            title: "Total",
            render: (_, record) => {
                return (
                    <div>
                        {record.qty ? (parseFloat(record.qty) * parseFloat(record.product_purchase_price)).toFixed(2)
                            : parseFloat(0)
                        }
                    </div>
                );
            }
        },
        {
            title: "Delete",
            render: (_, record) => {
                return (
                    <div className='action-btns stock-table-delete-item'>
                        <span>
                            <DeleteOutlined
                                onClick={() => handleDelete(record)}
                            />
                        </span>
                    </div>
                );
            },
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
                inputType: col.dataIndex === 'qty' || col.dataIndex === 'product_sale_price'   ? 'number' : 'text',
                editable: col.editable,
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
                components={components}
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
                footer={tableFooter}
            />
        </Form>

    );
};

export default StockNestedProductsTable;

