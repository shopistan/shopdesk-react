import React, {  useEffect, useState } from 'react';
import "./productsStyleMain.scss";
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as ProductsApiUtil from '../../../utils/api/products-api-utils';

const { Text } = Typography;

const DeleteProduct = (props) => {
    const history = useHistory();
    const [productData, setproductData] = useState({});
    const [loading, setLoading] = useState(true);
    const { match = {} } = props;
    const { product_id = {} } = match !== undefined && match.params;

    

    useEffect( () => {
        if (product_id !== undefined) { fetchProductData(product_id); }
        else {
            message.error("Product Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

    }, []);


    const fetchProductData = async (productId) => {

        const getProductsResponse = await ProductsApiUtil.getProduct(productId);
        console.log('getProductsResponse:', getProductsResponse);
        if (getProductsResponse.hasError) {
            console.log('Product Cant Fetched -> ', getProductsResponse.errorMessage);
            message.error(getProductsResponse.message, 3);
        }
        else {
            console.log('res -> ', getProductsResponse);
            message.success('product fetched Succesfully ', 3);
            setproductData(getProductsResponse.product);
            setLoading(false);
        }
    }
    

    const handleConfirm = async () => {
        const hide = message.loading('Saving changes in progress..', 0);
        const productDeleteResponse = await ProductsApiUtil.deleteProduct(productData.product_id);
        console.log('productDeleteResponse:', productDeleteResponse);

        if (productDeleteResponse.hasError) {
            console.log('Cant delete a product -> ', productDeleteResponse.errorMessage);
            message.error(productDeleteResponse.errorMessage, 3);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', productDeleteResponse);
            message.success(productDeleteResponse.message, 3);
            setTimeout(hide, 1500);
            setTimeout(() => {
                history.push({
                  pathname: '/products',
              });
            }, 2000);
        }
    };

    const handleCancel = () => {
        history.push({
            pathname: '/products',
        });
    };



    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'>Delete products</h1>
            </div>

            <div className="loading-container">
                {loading && <Spin tip="Products Loading..." size="large" ></Spin>}
            </div>

            {!loading &&

            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>

                            <Text>Do you really want to delete '
                                {productData &&
                                    productData.product_variant1_value !== "undefined" &&  productData.product_variant2_value !== "undefined" ? `${productData.product_name}/ ${productData.product_variant1_value}/ ${productData.product_variant2_value}`
                                    : productData.product_variant1_value !== "undefined" ? `${productData.product_name}/ ${productData.product_variant1_value}`
                                    : productData.product_variant2_value !== "undefined" ? `${productData.product_name}/ ${productData.product_variant2_value}`
                                    : productData.product_name
                                }

                                {productData.product_sku && 
                                 <span className='product-delete-sku-highlight'>&nbsp; • &nbsp;(SKU: <small>{productData.product_sku}</small> )</span>
                                }

                            '?</Text>

                        </div>

                    </div>
                    <br />
                    <div className='form__row--footer'>
                        <Button type='primary' danger
                            onClick={() => handleConfirm()}>
                            Confirm
                        </Button>

                        <Button
                            onClick={() => handleCancel()}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
            }

        </div>
    );
};

export default DeleteProduct;
