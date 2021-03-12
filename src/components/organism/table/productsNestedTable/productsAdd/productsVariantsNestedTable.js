import React, { useState, useEffect, useContext, useRef } from "react";
import { Table, Form, Input, Select, InputNumber } from "antd";
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
    taxesData,
    children,
    ...restProps
}) => {

    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);


    useEffect(() => {
        if (editing) {
            //inputRef.current.focus();
        }
    }, [editing]);


    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };


    const save = async (e) => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    var inputNode;

    inputNode = inputType === 'number' ?
        <InputNumber onPressEnter={save} onBlur={save} />
        : inputType === 'select' ? <Select onPressEnter={save} >
            {
                taxesData.map((obj, index) => {
                    return (
                        <option key={obj.tax_id} value={obj.tax_id}>
                            {`${obj.tax_name}(${obj.tax_value}%)`}
                        </option>
                    )
                })
            }
        </Select>
            : <Input onPressEnter={save} onBlur={save} />;



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
                <div className="editable-cell-value-wrap" onClick={toggleEdit} >
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};

/*------edittablecell------*/


const ProductsVariantsNestedTable = (props) => {
    const [data, setData] = useState([]);
    const [currentExpandedRow, setCurrentExpandedRow] = useState("");


    const handleSave = async (row, selectedRowId) => {

        const newData = [...data];
        const index = newData.findIndex(item => row.store_id === item.store_id);

        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });

            setData(newData); //previous code imp one
            props.onChangeProductsVariantsNestedData(newData, currentExpandedRow);

        };
    }


    useEffect(() => {
        setData(props.tableData);
        setCurrentExpandedRow(props.currentExpandedRow);

    }, [props.userStores, props.tableData, props.taxes, props.currentExpandedRow]);  /* imp passing props to re-render */

    
    var columns = null;

    columns = [
        {
            title: "Outlet Name",
            //dataIndex: "store_id",
            //width: "20%",
            render: (_, record) => {
                return (
                    <div>
                        {
                            props.userStores.map((store, index) => {
                                return (
                                    <span>{record.store_id === store.store_id ? store.store_name
                                        : ""
                                    }</span>
                                )
                            })
                        }
                    </div>
                );
            }
        },
        {
            title: "Tax",
            dataIndex: "tax_id",
            editable: true,
            width: "40%",
            render: (_, record) => {
                return (
                    <div >
                        <Select className='select-w-100' value={record.tax_id}>
                            {
                                props.taxes.map((obj, index) => {
                                    return (
                                        <option key={obj.tax_id} value={obj.tax_id}>
                                            {`${obj.tax_name}(${obj.tax_value}%)`}
                                        </option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                );
            }
        },
        {
            title: "Quantity",
            dataIndex: "qty",
            editable: true,
        },
    ];


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
                inputType: col.dataIndex === 'qty' ? 'number' : col.dataIndex === 'tax_id' ? 'select' : 'text',
                editable: col.editable,
                taxesData: props.taxes,
            }),
        };
    });


    return (
        <Table
            size="middle"
            bordered={true}
            columns={mergedColumns}
            dataSource={data}
            pagination={false}
            components={components}
            rowKey="store_id" ///vvv impp if not unique then issue
        />

    );
};

export default ProductsVariantsNestedTable;

