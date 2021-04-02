
import React, { useState, useEffect, useContext, useRef } from "react";
import "../productStyle.scss";
import { Table, message, Button, Input, Form, InputNumber, Typography, Popconfirm } from "antd";


/*------edittablecell------*/
//import { FormInstance } from 'antd/lib/form';
//const EditableContext = React.createContext<FormInstance>(null);

const EditableCell = ({
    record,
    dataIndex,
    title,
    inputType,
    editing,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber className='u-width-100' /> : <Input />;


    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    /*rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}*/
                >
                    {inputNode}
                </Form.Item>
            ) : (
                    children
                )}
        </td>
    );
};

/*------edittablecell------*/


const ProductsDiscountsTable = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.product_id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ ["discounted_price"]: record["discounted_price"] });
        setEditingKey(record.product_id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        //console.log("save-key", key);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex(item => key === item.product_id);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                //setData(newData); //previous code imp one
                setEditingKey('');
                props.onSaveProductsSpecialPrice(newData);

            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const handlePageChange = (page, pageSize) => {
        /*console.log(page);
        setcurrentPageNumber(page)
        props.onClickPageChanger(page);*/
    };


    const showTotalItemsBar = (total, range) => {
        //console.log(range);
        return `${range[0]}-${range[1]} of ${total} items`
    };

    useEffect(async () => {
        setData(props.tableData);
        if( props.paginationData && (currentPageNumber > Math.ceil(props.paginationData.totalPages))) {
            setcurrentPageNumber(1);
        }

    }, [props.tableData, props.tableDataLoading, props.paginationData]);  /* imp passing props to re-render */



    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          props.onSelectedTableRows(selectedRowKeys, selectedRows);
        },
       
    };


    var columns = null;


    columns = [
        {
            title: "Product Name",
            width: "20%",
            dataIndex: "product_name",
        },
        {
            title: "SKU",
            dataIndex: "product_sku",
            width: "20%",
        },
        {
            title: "Varaints",
            width: "25%",
            render: (_, record) => {
                return (
                    <div>
                        {record.product_name && 
                            <span className={`${record.product_variant1_name && record.product_variant2_name ? '' : 'products-zero-discount-tag'}`}>
                                {record.product_variant1_name && record.product_variant2_name  ? 
                                 <small>{record.product_variant1_value + '/ ' + record.product_variant2_value}</small> 
                                 : <small>single</small> 
                                }
                            </span>
                        }
                    </div>
                );
            }
        },
        {
            title: "Sale Price",
            dataIndex: "product_sale_price",
            
        },
        {
            title: "Discount",
            render: (_, record) => {
                let discounted_percentage = ( (parseFloat(record.discounted_price) / parseFloat(record.product_sale_price) )  * 100);
                discounted_percentage =  (100 - (parseFloat(discounted_percentage))).toFixed(2);
                return (
                    <div>
                        {record.product_sale_price && 
                            <span className={`${discounted_percentage >= 1 ? 'products-discount-tag' : 'products-zero-discount-tag'}`}>
                                {record.product_sale_price == '0' || isNaN(discounted_percentage) ? '0%'
                                 : discounted_percentage >= 1  ? discounted_percentage + '%' 
                                 : '0%'
                                }
                            </span>
                        }
                    </div>
                );
            }
        },
        {
            title: "Special Price",
            dataIndex: "discounted_price",
            width: "30%",
            editable: true,
            render: (_, record) => {
                return (
                    <span>
                        <Input className='u-width-100' value={record.discounted_price} readOnly  />
                    </span>
                );
            }
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a onClick={() => save(record.product_id)} style={{ marginRight: 8 }}>
                            Apply
                        </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];



    const components = {
        body: {
            cell: EditableCell,
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
                //handleSave: handleSave,
                inputType: col.dataIndex === 'discounted_price' ? 'number' : 'text',
                editing: isEditing(record),
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
                pagination={{
                    total: props.data && props.data.length,
                    showTotal: (total, range) => showTotalItemsBar(total, range),
                    defaultPageSize: 20,
                    pageSize: parseInt(props.pageLimit),
                    showSizeChanger: false,
                    //current: currentPageNumber,
                    //onChange: (page, pageSize) => handlePageChange(page, pageSize),
                    //position: ["topRight"]
                }}
                loading={props.tableDataLoading}
                rowKey="product_id"
                rowSelection={{
                    ...rowSelection,
                }}
            />
        </Form>

    );
};

export default ProductsDiscountsTable;

