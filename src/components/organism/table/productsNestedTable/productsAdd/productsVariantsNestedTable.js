import React, { useState, useEffect, useContext, useRef } from "react";
import { Table, Form, Input, Select, InputNumber } from "antd";
const EditableContext = React.createContext(null);

const { Option } = Select;


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
        <InputNumber ref={inputRef}  onBlur={save} />
        : <Input ref={inputRef} onBlur={save} />;



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
    const [selectedInputTaxVal, setSelectedInputTaxVal] = useState({});


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


    const onChangeSelectTax = (value, currentRowId) => {
        var selectTaxData = {...selectedInputTaxVal};
        selectTaxData[currentRowId] = value;
        setSelectedInputTaxVal(selectTaxData);  //imp
        handleTableData(props.tableData, selectTaxData);   //imp

    }


    const setSelectedTaxChange = (tableData, currentRowId) => {
        var selectTaxData = {...selectedInputTaxVal};
        tableData.forEach(item => {
            let selectInputId = item.store_id;
            selectTaxData[selectInputId] = item.tax_id;

        });

        setSelectedInputTaxVal(selectTaxData);  //imp
        handleTableData(props.tableData, selectTaxData);   //imp

    }


    const handleTableData = (tableData, taxData) => {
        var newData = [...tableData];
        newData.forEach(item => {
            let taxValue =  taxData[item.store_id] && taxData[item.store_id];
            item.tax_id = taxValue;
        });

        setData(newData);   //imp

    }




    useEffect(() => {
        //setData(props.tableData);
        //console.log(props.tableData);
        setCurrentExpandedRow(props.currentExpandedRow);
        setSelectedTaxChange(props.tableData, props.currentExpandedRow);

    }, [props.userStores,props.tableData, props.taxes, props.currentExpandedRow]);  /* imp passing props to re-render */


    
    var columns = null;

    columns = [
        {
            title: "Outlet Name",
            //dataIndex: "store_id",
            //width: "30%",
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
            //dataIndex: "tax",
            //editable: true,
            width: "40%",
            render: (_, record) => {
                //let selectInputRowId = record.store_id+'_'+currentExpandedRow;
                let selectInputRowId = record.store_id;

                return (
                    <div >
                        <Select 
                            className='select-w-100'
                            value={selectedInputTaxVal[selectInputRowId]}
                            onChange={(value) => onChangeSelectTax(value, selectInputRowId)}
                        >
                            {
                                props.taxes.map((obj, index) => {
                                    return (
                                        <Option key={obj.tax_id} value={obj.tax_id}>
                                            {`${obj.tax_name}(${obj.tax_value}%)`}
                                        </Option>
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
            //width: "30%",
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
                inputType: col.dataIndex === 'qty' ? 'number' : 'text',
                editable: col.editable,
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

