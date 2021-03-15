
import React, { useState, useEffect, useContext, useRef } from "react";
import "../productStyle.scss";
import { Table, message, Button, Input, Form, InputNumber, } from "antd";
import ProductsVariantsNestedTable from "./productsVariantsNestedTable";

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
                /*rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]} */
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


const ProductsVariantsTable = (props) => {
    const [data, setData] = useState([]);
    const [tableExpandedRows, setTableExpandedRows] = useState([]);


    const tableExpandedRowRender = (record, index, indent, expanded) => {
        var outletsData;
        if (data[parseInt(record.variant_row_id)]) {
            outletsData = data[parseInt(record.variant_row_id)].outletInfo;
        }

        return <ProductsVariantsNestedTable
            tableData={outletsData}
            userStores={props.userStores} taxes={props.taxes}
            onChangeProductsVariantsNestedData={handleSaveUpdatedNestedVariantsData}
            currentExpandedRow={record.variant_row_id} />;

    };



    const handleSaveUpdatedNestedVariantsData = (updatedOutletsVariantsNestedData, currentExpandedRow) => {
        var newData = [...data];
        const index = newData.findIndex(item => currentExpandedRow == item.variant_row_id);
        if (index > -1) {
            const item = newData[index];
            item.outletInfo = updatedOutletsVariantsNestedData;
            newData.splice(index, 1, {
                ...item,
            });

            props.onChangeProductsVariantsData(newData);  //impp 
        }

    }


    const onRowExpand = (expanded, record) => {
        toggleExpandByVariantId(record.variant_row_id);
    }

    const toggleExpandByVariantId = variantRowId => {
        var expandedRows = tableExpandedRows;
        const index = expandedRows.indexOf(variantRowId.toString());
        if (index > -1) {
            expandedRows.splice(index, 1);
        }
        else {
            expandedRows.push(variantRowId.toString());  /*imp convert to string[]*/
            console.log(expandedRows);
        }

        setTableExpandedRows([...expandedRows]);  //vvimp to re-render

    };


    const handleSave = async (row) => {
        const newData = [...data];
        const index = newData.findIndex(item => row.variant_row_id === item.variant_row_id);

        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });

            //setData(newData); //previous code imp one
            props.onChangeProductsVariantsData(newData);
        };
    }



    useEffect(() => {
        setData(props.tableData);

    }, [props.tableData, props.tableDataLoading, props.userStores, props.taxes, tableExpandedRows]);  /* imp passing props to re-render */


    var columns = null;

    columns = [
        {
            title: "Varaint Name",
            //width: "20%",
            render: (_, record) => {
                return (
                    <div>
                        {
                            <span >
                                {record.var1_text && record.var2_text ? <small>{record.var1_text + '/ ' + record.var2_text}</small>
                                    : record.var1_text ? <small>{record.var1_text}</small>
                                        : record.var2_text ? <small>{record.var2_text}</small>
                                            : ""
                                }
                            </span>
                        }
                    </div>
                );
            }
        },
        {
            title: "SKU",
            //dataIndex: "sku",
            //width: "30%",
            editable: true,
            render: (_, record) => {
                return (
                    <div>
                        {
                            <span >
                                {record.var1_text && record.var2_text ? <small>{ record.sku+'-'+record.var1_text + '- ' + record.var2_text}</small>
                                    : record.var1_text ? <small>{record.sku+'-'+record.var1_text+'-'+'Default'}</small>
                                    : ""
                                }
                            </span>
                        }
                    </div>
                );
            }
        },
        {
            title: "Purchase Price",
            dataIndex: "purchase",
            //width: "20%",
            editable: true,
        },
        {
            title: "Sale Price",
            dataIndex: "sale",
            //width: "20%",
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
                inputType: col.dataIndex === 'purchase' || col.dataIndex === 'sale' ? 'number' : 'text',
                editable: col.editable,
            }),
        };
    });


    return (

        <Table
        
            bordered={true}
            columns={mergedColumns}
            dataSource={data}
            rowClassName='editable-row'
            components={components}
            loading={props.tableDataLoading}
            rowKey="variant_row_id"   //must be string and unique
            expandedRowKeys={tableExpandedRows}
            expandedRowRender={tableExpandedRowRender}
            onExpand={onRowExpand}

        />

    );
};

export default ProductsVariantsTable;
