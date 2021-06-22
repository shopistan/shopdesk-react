import React, { useState, useEffect } from "react";
import { Table, Form, Typography, message, Button } from "antd";
import {
    CloudDownloadOutlined,
  } from "@ant-design/icons";
import { useHistory } from 'react-router-dom';
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import { getDataFromLocalStorage, checkUserAuthFromLocalStorage } from "../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../utils/constants/constants';
import * as Helpers from "../../../../utils/helpers/scripts";
import {
    BarcodeOutlined,
} from "@ant-design/icons";


const ProductsViewNestedTable = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const history = useHistory();


    const handleDelete = (record) => {
        history.push({
            pathname: `/products/${record.product_id}/delete`,
            data: record // your data array of objects
        });
    };

    const edit = (record) => {
        history.push({
            pathname: `/products/${record.product_id}/edit`,
            data: record // your data array of objects
        });
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

    const fetchProductsVariantsData = async (productUniqueId) => { 

        document.getElementById('app-loader-container').style.display = "block";
        const productsVariantsResponse = await ProductsApiUtil.viewVariants(productUniqueId);
        console.log('productsVariantsResponse:', productsVariantsResponse);
        if (productsVariantsResponse.hasError) {
            console.log('Cant fetch product Variants -> ', productsVariantsResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', productsVariantsResponse);
            //message.success(productsVariantsResponse.message, 3);
            setData(productsVariantsResponse.products);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
    }


    const toggleFetchProductLookupData = (record) => {
        props.onClickFetchProductLookupData(record);
    };

    useEffect(async () => {
        fetchProductsVariantsData(props.productUniqId);

    }, [props.productUniqId]);  /* imp passing props to re-render */

    var columns = null;


    if (props.originPage && props.originPage === 'lookup' ) {
        columns = [
            {
                title: "product Name",
                dataIndex: "product_name",
                width: "20%",
            },
            {
                title: "SKU",
                dataIndex: "product_sku",
            },
            {
                title: "Varaint 1",
                dataIndex: "product_variant1_value",
            },
            {
                title: "Varaint 2",
                dataIndex: "product_variant2_value",
            },
            {
                title: "Fetch",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <Button
                                type='Default'
                                icon={<CloudDownloadOutlined />}
                                onClick={() => toggleFetchProductLookupData(record)}
                                >
                            </Button>
                        </div>
                    );
                }
            },
        ];

    }


    else {
        columns = [
            {
                title: "product Name",
                dataIndex: "product_name",
                width: "20%",
                render: (_, record) => { 
                    return (
                        <div>
                            {record.product_name &&
                                Helpers.var_check_updated(record.product_variant1_value) ? Helpers.var_check_updated(record.product_variant2_value) ? <small>{record.product_name + '/ ' + record.product_variant1_value + '/ ' + record.product_variant2_value}</small>
                                    : <small>{record.product_name + ' / ' + record.product_variant1_value}</small>
                                : Helpers.var_check_updated(record.product_variant2_value) ? <small>{record.product_name + ' / ' + record.product_variant2_value}</small>
                                    : record.product_name
                            }
                        </div>
                    );
                }
            },
            {
                title: "Quantity",
                dataIndex: "product_quantity",
                width: "15%",
            },
            ,
            {
                title: "Sale Price",
                dataIndex: "product_sale_price",
                width: "15%",
            },
            {
                title: "Barcode",
                width: "5%",
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
        <Table
            size="middle"
            bordered={true}
            columns={mergedColumns}
            dataSource={data}
            pagination={false}
            //loading={loading}
            rowKey="product_id"
        />

    );
};

export default ProductsViewNestedTable;

