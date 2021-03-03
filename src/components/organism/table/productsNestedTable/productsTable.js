import React, { useState, useEffect } from "react";
import "./productStyle.scss";
import { Table, Form, Typography } from "antd";
import { useHistory } from 'react-router-dom';
import ProductsNestedTable from "./productsViewNestedTable";
import { getDataFromLocalStorage, checkUserAuthFromLocalStorage } from "../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../utils/constants/constants';


import {
    BarcodeOutlined,
} from "@ant-design/icons";

import { result } from "lodash";


const ProductsTable = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const [tableExpandedRows, setTableExpandedRows] = useState([]);
    const history = useHistory();


    const handleDelete = (record) => {
        if(record.variant>1){ return toggleExpandByproductId(record.product_id);}
        history.push({
            pathname: `/products/${record.product_id}/delete`,
            data: record // your data array of objects
        });
    };

    const edit = (record) => {
        if(record.variant>1){ return toggleExpandByproductId(record.product_id);}
        history.push({
            pathname: `/products/${record.product_id}/edit`,
            data: record // your data array of objects
        });
    };

    const showTotalItemsBar = (total, range) => {
        //console.log(range);
        return `${range[0]}-${range[1]} of ${total} items`
    };

    const handlePageChange = (page, pageSize) => {
        setcurrentPageNumber(page)
        props.onClickPageChanger(page);
    };

    const barcodeGenerator = (record) => {
        let count = window.prompt(
            `No. of barcodes for SKU: ${record.product_sku}`,
            0
        );

        var storeObj = null;
        var symbol = null;
        var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
        readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
        if (readFromLocalStorage) {
            symbol = readFromLocalStorage.currency.symbol;
            if (checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication) {
                var foundStoreObj = readFromLocalStorage.auth.storeInfo.find(obj => {
                    return obj.store_id === readFromLocalStorage.auth.current_store
                })
                if (foundStoreObj) { storeObj = foundStoreObj; }
            }
            else { storeObj = null; }
        }


        let redirectString = `http://tools.workify.xyz/barcode/index.php?barcode=${record.product_sku}
            &name=${record.product_sku}%20&count=${count}&price=${symbol}${record.product_sale_price}
            &logo=${storeObj && storeObj.store_name}&pname=${record.product_name}`;


        var win = window.open(
            redirectString,
            "_blank",
            "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=50,width=600,height=500"
        );
        //win.focus();

    }

    const toggleVariants = (record) => {
        toggleExpandByproductId(record.product_id);
    };


    const tableExpandedRowRender = (record, index, indent, expanded) => {
        return <ProductsNestedTable productUniqId={record.product_unique} />;
    };


    const onRowExpand = (expanded, record) => {
        toggleExpandByproductId(record.product_id);
    }

    const toggleExpandByproductId = productId => {
        var expandedRows = tableExpandedRows;
        const index = expandedRows.indexOf(productId.toString());
        if (index > -1) {
            expandedRows.splice(index, 1);
        }
        else {
            expandedRows.push(productId.toString());  /*imp convert to string[]*/
            console.log(expandedRows);
        }

        setTableExpandedRows([...expandedRows]);  //vvimp to re-render

    };

    useEffect(async () => {
        setData(props.tableData);
        if (currentPageNumber > Math.ceil(props.paginationData.totalPages)) {
            setcurrentPageNumber(1);}

    }, [props.tableData, props.tableDataLoading, props.paginationData, tableExpandedRows]);  /* imp passing props to re-render */




    const columns = [
        {
            title: "product Name",
            dataIndex: "product_name",
            width: "10%",
            render: (_, record) => {
                return (
                    <div>
                        {record.product_name}
                        <br />
                        <small>{record.product_sku}</small>
                    </div>
                );
            }
        },
        {
            title: "Category",
            dataIndex: "category_name",
        },
        ,
        {
            title: "QTY",
            dataIndex: "product_quantity",
        },
        {
            title: "Variants",
            //dataIndex: "variant",
            render: (_, record) => {
                return (
                    <div className='action-btns'>
                        <Typography.Link
                            onClick={() => toggleVariants(record)}>
                            {record.variant > 1 ? record.variant + "variants" : '-'}
                        </Typography.Link>
                    </div>
                );
            }
        },
        {
            title: "Sale Price",
            dataIndex: "product_sale_price",
        },
        {
            title: "Barcode",
            render: (_, record) => {
                return (
                    <div className='action-btns'>
                        <BarcodeOutlined
                            onClick={() => barcodeGenerator(record)}
                        >
                        </BarcodeOutlined>
                    </div>
                );
            }
        },
        {
            title: "operation",
            dataIndex: "operation",
            render: (_, record) => {
                return (
                    <div className='action-btns'>
                        <Typography.Link
                            onClick={() => edit(record)}
                        >
                        Edit
                        </Typography.Link>
                        {data.length >= 1 ? (
                            <Typography.Link
                                onClick={() => handleDelete(record)}
                            >
                            delete
                            </Typography.Link>

                        ) : null}
                    </div>
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

        <Table
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName='editable-row'
            className='table-frame'
            pagination={{
                total: props.paginationData && props.paginationData.totalElements,
                showTotal: (total, range) => showTotalItemsBar(total, range),
                defaultPageSize: 20,
                pageSize: parseInt(props.pageLimit),
                showSizeChanger: false,
                current: currentPageNumber,
                onChange: (page, pageSize) => handlePageChange(page, pageSize),
                position: ["topRight"]
            }}
            loading={props.tableDataLoading}
            rowKey="product_id"
            expandedRowKeys={tableExpandedRows}
            expandedRowRender={tableExpandedRowRender}
            onExpand={onRowExpand}

        />

    );
};

export default ProductsTable;

