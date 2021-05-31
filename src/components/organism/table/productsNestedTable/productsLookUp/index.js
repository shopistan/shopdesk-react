import React, { useState, useEffect } from "react";
import "../productStyle.scss";
import { Table, message, } from "antd";
import * as ProductsApiUtil from '../../../../../utils/api/products-api-utils';
import { getDataFromLocalStorage, checkUserAuthFromLocalStorage } from "../../../../../utils/local-storage/local-store-utils";
import Constants from '../../../../../utils/constants/constants';


const ProductsLookUpTable = (props) => {
    const [data, setData] = useState([]);
    const [currentStoreId, setCurrentStoreId] = useState("");
    const [loading, setLoading] = useState(true);


    const fetchProductsLookUpData = async (productSku) => {

        const productsLookUpResponse = await ProductsApiUtil.productsLookUp(productSku);
        console.log('productsLookUpResponse:', productsLookUpResponse);
        if (productsLookUpResponse.hasError) {
            console.log('Cant fetch product Lookup Data -> ', productsLookUpResponse.errorMessage);
            setLoading(false);
        }
        else {
            console.log('res -> ', productsLookUpResponse);
            message.success(productsLookUpResponse.message, 3);
            setData(productsLookUpResponse.data);
            setLoading(false);
        }
    }



    useEffect(async () => {
        fetchProductsLookUpData(props.productSku);

        var readFromLocalStorage = getDataFromLocalStorage(
            Constants.USER_DETAILS_KEY
        );
        readFromLocalStorage = readFromLocalStorage.data
            ? readFromLocalStorage.data
            : null;
        if (readFromLocalStorage) {
            if (
                checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
            ) {
                setCurrentStoreId(readFromLocalStorage.auth.current_store);
            } else {
                setCurrentStoreId("");
            }
        }


    }, [props.productSku]);  /* imp passing props to re-render */

    var columns = null;


    columns = [
        {
            title: "Store Name",
            width: "15%",
            render: (_, record) => {
                return (
                    <div>
                        <span>
                            {record.store.store_name}&nbsp;&nbsp;
                        </span>
                        {currentStoreId && currentStoreId === record.store.store_id &&
                            <span className='products-lookup-store' >
                                <small>Current</small>
                            </span>
                        }
                    </div>
                );
            }
        },
        {
            title: "Product Name",
            render: (_, record) => {
                return (
                    <span>
                        {record.product.product_name}
                    </span>
                );
            }
        },
        {
            title: "SKU",
            render: (_, record) => {
                return (
                    <span>
                        {record.product.product_sku}
                    </span>
                );
            }
        },
        {
            title: "Varaint 1",
            render: (_, record) => {
                return (
                    <span>
                        {record.product.product_variant1_value}
                    </span>
                );
            }
        },
        {
            title: "Varaint 2",
            render: (_, record) => {
                return (
                    <span>
                        {record.product.product_variant2_value}
                    </span>
                );
            }
        },
        {
            title: "Count",
            //dataIndex: "product_quantity",
            render: (_, record) => {
                return (
                    <span className='products-lookup-count'>
                        {record.product.product_quantity + ' pcs'}
                    </span>
                );
            }
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

            bordered={true}
            columns={mergedColumns}
            dataSource={data}
            pagination={false}
            loading={loading}
        />

    );
};

export default ProductsLookUpTable;

