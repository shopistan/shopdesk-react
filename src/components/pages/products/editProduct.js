import React, { useState, useEffect } from "react";
import "./productsStyleMain.scss";
import { useHistory } from 'react-router-dom';


import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Upload,
    message,
    Space,
    Checkbox,
    Spin,
} from "antd";

import {
    UploadOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";

import * as ProductsApiUtil from '../../../utils/api/products-api-utils';
import * as TaxexApiUtil from '../../../utils/api/tax-api-utils';
import * as CategoriesApiUtil from '../../../utils/api/categories-api-utils';
//import UrlConstants from '../../../utils/constants/url-configs';
import * as Helpers from "../../../utils/helpers/scripts";


const { TextArea } = Input;
const { Option } = Select;

const EditProduct = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [productData, setproductData] = useState({});
    const [categories, setCategories] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productImagePreviewSource, setproductImagePreviewSource] = useState("");
    const [isImageUpload, setIsImageUpload] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [inclusiveTax, setInclusiveTax] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { product_id = {} } = match !== undefined && match.params;


    let mounted = true;


    useEffect( () => {
        if (product_id !== undefined) { fetchProductData(product_id); }
        else {
            message.error("Product Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 2000);
        }

        return () => {
            mounted = false;
        }

    }, []);


    const fetchProductData = async (productId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getProductsResponse = await ProductsApiUtil.getProduct(productId);
        console.log('getProductsResponse:', getProductsResponse);
        if (getProductsResponse.hasError) {
            console.log('Product Cant Fetched -> ', getProductsResponse.errorMessage);
            message.error('Product Cant Fetched', 3);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', getProductsResponse);
            //message.success('product fetched Succesfully ', 3);
            var productsData = getProductsResponse.product;
            setproductData(productsData);

            //delete productsData['product_purchase_price'];

            /*-----setting products data to fields value------*/
            form.setFieldsValue({
                sku: productsData.product_sku,
                product_name: productsData.product_name,
                product_description: removeHTML(productsData.product_description),
                sale_price: productsData.product_sale_price,
                purchase_price: Helpers.var_check(productsData.product_purchase_price) ?
                    productsData.product_purchase_price  === "0" ? 'N/A': productsData.product_purchase_price : 'N/A',
                product_variant1_key: productsData.product_variant1_name,
                product_variant1_value: productsData.product_variant1_value,
                product_variant2_key: productsData.product_variant2_name,
                product_variant2_value: productsData.product_variant2_value,

            });

            setproductImagePreviewSource(productsData.product_image);  //imp to set image src here

            /*-----setting products data to fields value------*/
            //var pageLimit = 50;
            //var pageNumber = 1;
            const [categoriesRes, taxesRes] = await Promise.all([CategoriesApiUtil.viewAllCategories(),
            TaxexApiUtil.viewAllTaxes()]);

            /*  categories response  */
            if (categoriesRes.hasError) {
                console.log('getcategoriesRes RESPONSE FAILED -> ', categoriesRes.errorMessage);
            }
            else {
                console.log('res -> ', categoriesRes);
                const getCategoryResponse = await CategoriesApiUtil.getCategory(productsData.category_id);
                console.log('getCategoryResponse:', getCategoryResponse);
                if (getCategoryResponse.hasError) {
                    console.log('getCategory Cant Fetched -> ', getCategoryResponse.errorMessage);
                }
                else {
                    var categoriesData = categoriesRes.categories.data ?
                        categoriesRes.categories.data : categoriesRes.categories;

                    var foundObj = categoriesData.find(obj => {
                        return obj.category_name === getCategoryResponse.category_name[0].category_name;
                    });
                    if (!foundObj) {
                        categoriesData.push({
                            category_id: productsData.category_id,
                            category_name: getCategoryResponse.category_name[0].category_name
                        });
                    }
                }

                setCategories(categoriesData);
                form.setFieldsValue({ category: productsData.category_id }); //ok correct  for option select value

            }
            /*  categories response  */

            /*  taxes response  */
            if (taxesRes.hasError) {
                console.log('gettaxesRes RESPONSE FAILED -> ', taxesRes.errorMessage);
            }
            else {
                console.log('res -> ', taxesRes);
                const gettaxResponse = await TaxexApiUtil.getTax(productsData.tax_id);
                console.log('gettaxResponse:', gettaxResponse);
                if (gettaxResponse.hasError) {
                    console.log('getTax Cant Fetched -> ', gettaxResponse.errorMessage);
                }
                else {
                    var taxesData = taxesRes.taxes.data ? taxesRes.taxes.data : taxesRes.taxes;
                    var foundObj = taxesData.find(obj => {
                        return obj.tax_id === gettaxResponse.tax[0].tax_id;
                    });
                    if (!foundObj) { taxesData.push(gettaxResponse.tax[0]); }
                }

                setTaxes(taxesData);
                form.setFieldsValue({ tax: productsData.tax_id }); //ok correct  for option select value

            }

            /*  taxes response  */
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
            message.success(getProductsResponse.message, 2);

        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values) => {
        //console.log("changed", values);

        var formValues = form.getFieldsValue();
        //console.log("changed", formValues);

        const productDataDeepClone = JSON.parse(JSON.stringify(productData)); //imp to make adeep copy

        productDataDeepClone.product_sku = formValues.sku;
        productDataDeepClone.product_description = formValues.product_description ?
            `<div>${formValues.product_description}</div>` : '';
        productDataDeepClone.product_track = productDataDeepClone.product_track === "0" ? false : true;
        productDataDeepClone.product_image = productImagePreviewSource;
        if (isImageUpload) { productDataDeepClone.img = productImagePreviewSource; } //discuss
        productDataDeepClone.product_purchase_price = formValues.purchase_price;
        productDataDeepClone.tax_id = formValues.tax;
        productDataDeepClone.category_id = formValues.category;
        productDataDeepClone.product_name = formValues.product_name;
        productDataDeepClone.product_sale_price = formValues.sale_price;
        productDataDeepClone.product_variant1_value = formValues.product_variant1_value;
        productDataDeepClone.product_variant2_value = formValues.product_variant2_value;
        if (formValues.product_attributes) { productDataDeepClone.product_attributes = ''; }  //needs discussion here
        productDataDeepClone.inclusive = inclusiveTax;
        productDataDeepClone.attributes = formValues.product_attributes ? formValues.product_attributes : "0";
        delete productDataDeepClone['status'];  //imp to delete

        
        if (buttonDisabled === false) {
            setButtonDisabled(true);}

        document.getElementById('app-loader-container').style.display = "block";
        const EditProductResponse = await ProductsApiUtil.editProduct(productDataDeepClone);
        console.log('getProductsResponse:', EditProductResponse);
        if (EditProductResponse.hasError) {
            console.log('product Editing UnSuccesfully -> ', EditProductResponse.errorMessage);
            setButtonDisabled(false);
            document.getElementById('app-loader-container').style.display = "none";
            message.error(EditProductResponse.errorMessage, 2);
        }
        else {
            console.log('res -> ', EditProductResponse);
            document.getElementById('app-loader-container').style.display = "none";
            if (mounted) {     //imp if unmounted
                message.success(EditProductResponse.message, 1);
                setTimeout(() => {
                    history.push({
                        pathname: '/products',
                    });
                }, 1200);
            }

        }

    }

    function removeHTML(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    const handleUpload = async () => {
        //console.log(fileList[0]);   //imp
        document.getElementById('app-loader-container').style.display = "block";
        const ImageUploadResponse = await ProductsApiUtil.imageUpload(fileList[0]);
        console.log('ImageUploadResponse:', ImageUploadResponse);
        if (ImageUploadResponse.hasError) {
            console.log('Product Image Cant Upload -> ', ImageUploadResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            message.error('Product  Image Cant Upload', 3);
        }
        else {
            console.log('res -> ', ImageUploadResponse);
            document.getElementById('app-loader-container').style.display = "none";
            message.success(ImageUploadResponse.message, 3);
            setFileList([]);
            setproductImagePreviewSource(ImageUploadResponse.upload_data);
            setIsImageUpload(true);
        }

    };

    const imageUploadProps = {
        beforeUpload: file => {
            setFileList([file]);

            return false;
        },
        fileList,
    };


    const onRemoveImage = (file) => {
        setFileList([]);
    };


    const onInclusiveTaxChecked = (e) => {
        setInclusiveTax(e.target.checked);
    };


    const handleCancel = () => {
        history.push({
            pathname: '/products',
        });
    };


    var ProductImageSrc = `${productImagePreviewSource}`;  //imp to set image source


    return (

        <div className='page dashboard'>
            <div className='page__header'>
                <h1><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Edit Products</h1>
            </div>


            {!loading &&
                <div className='page__content'>
                    <div className='page__form'>
                        <Form
                            form={form}
                            name='basic'
                            layout='vertical'
                            //initialValues={{ }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >

                            <div className='form__row--footer'>
                                <Button type='primary'
                                    className='custom-btn--primary'
                                    htmlType='submit'
                                    disabled={buttonDisabled} >
                                    Edit Product
                                </Button>
                            </div>

                            {/* Form Section */}
                            <div className='form__section'>
                                {/* Row */}
                                <div className='form__row'>
                                    <div className='form__col'>
                                        <Form.Item
                                            label='SKU'
                                            name='sku'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input SKU",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>

                                    <div className='form__col'>
                                        <Form.Item
                                            label='Product Name'
                                            name='product_name'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input product name",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </div>
                                {/* Row */}

                                {/* Row */}
                                <div className='form__row'>
                                    <div className='form__col'>
                                        <Form.Item
                                            label='Product Description'
                                            name='product_description'
                                        >
                                            <TextArea rows={6} />
                                        </Form.Item>
                                    </div>
                                </div>
                                {/* Row */}

                                {/* Row */}
                                <div className='form__row'>
                                    <div className='form__col'>
                                        <Form.Item
                                            label='Tax'
                                            name='tax'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input Tax",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch    //vimpp to seach
                                                placeholder="Select Tax"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                }
                                            >
                                                {
                                                    taxes.map((obj, index) => {
                                                        return (
                                                            <Option key={obj.tax_id} value={obj.tax_id}>
                                                                {`${obj.tax_name}(${obj.tax_value}%)`}
                                                            </Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <div className='form__col'>
                                        <Form.Item
                                            label='Select Category'
                                            name='category'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch    //vimpp to seach
                                                placeholder="Select Category"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                }
                                            
                                            >
                                                {
                                                    categories.map((obj, index) => {
                                                        return (
                                                            <Option key={obj.category_id} value={obj.category_id}>
                                                                {obj.category_name}
                                                            </Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                                {/* Row */}

                                {/* Row */}
                                <div className='form__row'>
                                    <div className='form__col'>
                                        <Form.Item
                                            label='Purchase Price'
                                            name='purchase_price'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                min={0}
                                                className='u-width-100'
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className='form__col'>
                                        <Form.Item
                                        >
                                            <span><Checkbox className='inclusive-sale-price-check' onChange={onInclusiveTaxChecked} >
                                                <small>Sale price inclusive of tax</small></Checkbox>
                                            </span>
                                        </Form.Item>

                                        <Form.Item
                                            label='Sale Price'
                                            name='sale_price'
                                            className='product-sale-price-margin'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                min={0}
                                                className='u-width-100'
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                {/* Row */}

                                {/* Row */}
                                <div className='form__row'>
                                    <div className='form__col'>
                                        <Form.Item
                                            label='Product Image'
                                        >
                                            <Upload {...imageUploadProps} onRemove={onRemoveImage}>
                                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                            </Upload>
                                        </Form.Item>
                                    </div>

                                    <div className='form__col form__col--button'>
                                        <Form.Item className='u-width-100'>
                                            <Button type='default' onClick={handleUpload}>
                                                Upload
                                             </Button>
                                        </Form.Item>
                                    </div>

                                </div>
                                {/* Row */}

                                {/* Row */}
                                <div className='form__row'>
                                    <div className='form__col'>
                                        <Form.Item>
                                            <img className='thumbnail' src={ProductImageSrc}></img>
                                        </Form.Item>
                                    </div>

                                </div>
                                {/* Row */}

                            </div>
                            {/* Form Section */}


                            {/* Form Section */}
                            <div className='form__section'>
                                <div className='form__section__header'>
                                    <h2>Attributes</h2>
                                    <p>
                                        The attributes allows you to store additional information for
                                        products. You cannot search for attributes or filter by an
                                        attribute.
                                </p>
                                </div>

                                <div>
                                    <Form.List name='product_attributes' className='attribute'>
                                        {(fields, { add, remove }) => (
                                            <div className='form__row form__row--full-col'>
                                                <div className='form__col'>
                                                    {fields.map((field) => (
                                                        <Space
                                                            key={field.key}
                                                            style={{ display: "flex", marginBottom: 8 }}
                                                            align='baseline'
                                                            className='attribute__wrapper'
                                                        >
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, "key"]}
                                                                fieldKey={[field.fieldKey, "key"]}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Missing Atrribute Key",
                                                                    },
                                                                ]}
                                                                className='attribute__input'
                                                            >
                                                                <Input placeholder='Key' />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...field}
                                                                name={[field.name, "value"]}
                                                                fieldKey={[field.fieldKey, "value"]}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Missing Attribute Value",
                                                                    },
                                                                ]}
                                                                className='attribute__input'
                                                            >
                                                                <Input placeholder='Value' />
                                                            </Form.Item>
                                                            <MinusCircleOutlined
                                                                onClick={() => remove(field.name)}
                                                            />
                                                        </Space>
                                                    ))}
                                                </div>

                                                <div className='form__col'>
                                                    <Form.Item>
                                                        <Button
                                                            type='dashed'
                                                            onClick={() => add()}
                                                            block
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Add Attribute
                                                    </Button>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                            {/* Form Section */}
                            {/*    products-variants-edit    */}
                            {/* Form Section */}

                            <div className='form__section'>

                                {(productData && productData.product_variant1_name &&
                                    productData.product_variant2_name)
                                    &&
                                    <div className='form__section__header'>
                                        <h2>product Variants</h2>
                                    </div>}


                                {/* Row */}
                                {productData && productData.product_variant1_name &&
                                    <div className='form__row'>
                                        <div className='form__col'>
                                            <Form.Item
                                                label='Attribute'
                                                name='product_variant1_key'
                                            >
                                                <Input className='products-variants-attribute-key-disabled' disabled />
                                            </Form.Item>
                                        </div>
                                        <div className='form__col'>
                                            <Form.Item
                                                label='Value'
                                                name='product_variant1_value'
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>}

                                {/* Row */}

                                {/* Row */}
                                {productData && productData.product_variant2_name &&
                                    <div className='form__row'>
                                        <div className='form__col'>
                                            <Form.Item
                                                label='Attribute'
                                                name='product_variant2_key'
                                            >
                                                <Input className='products-variants-attribute-key-disabled' disabled />
                                            </Form.Item>
                                        </div>
                                        <div className='form__col'>
                                            <Form.Item
                                                label='Value'
                                                name='product_variant2_value'
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>}

                                {/* Row */}

                            </div>

                            {/* Form Section */}
                            {/*    products-variants-edit    */}

                            <div className="form__row--footer">
                                <Button type='primary'
                                    className='custom-btn--primary'
                                    htmlType='submit'
                                    disabled={buttonDisabled} >
                                    Edit Product
                                    </Button>
                            </div>
                            

                        </Form>
                    </div>
                </div>

            }
        </div>
    );
};

export default EditProduct;
