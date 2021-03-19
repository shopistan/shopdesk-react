import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import $ from 'jquery';


export const addProduct = async (productAddData) => {
    //const addProductFormDataBody = createComplexAddFormData(productAddData);  //impp
    const addProductFormDataBody =  $.param(productAddData);

    const url = UrlConstants.PRODUCTS.ADD_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addProductFormDataBody //body
    );
};


export const productsBulkUpload = async (bulkProducts) => {
    /*const bulkProductsDataBody = {
        products: bulkProducts,
    };*/

    const bulkProductsDataBody =  $.param({products: bulkProducts});
    const url = UrlConstants.PRODUCTS.BULK_UPLOAD;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        bulkProductsDataBody //body
    );
};

export const viewVariants = async (productUniqueId) => {
    const formDataPair = {
        id: productUniqueId
    };
    const productVariantsFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.VIEW_VARIANTS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        productVariantsFormDataBody //body
    );
};


export const productsLookUp = async (productSku) => {

    const url = UrlConstants.PRODUCTS.LOOKUP + `/${productSku}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const viewProducts = async (limit, PageNumber) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
    };
    const viewProductsFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.VIEW;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewProductsFormDataBody,
    );
};


export const getRegisteredProducts = async (limit, PageNumber) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
    };
    const viewRegisteredProductsFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.GET_REGISTERED_PRODUCTS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewRegisteredProductsFormDataBody,
    );
};

export const getFullRegisteredProducts = async () => {
    
    const url = UrlConstants.PRODUCTS.GET_FULL_REGISTERED_PRODUCTS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};


export const saveProductsDiscountedData = async (discountedProducts) => {
    var discountedProductsFormDataBody = new FormData;
    for (var i = 0; i < discountedProducts.length; i++) {
        Object.entries(discountedProducts[i]).forEach(
            ([formDataKey, formDataValue]) => {
                discountedProductsFormDataBody.append(`products[${i}][${formDataKey}]`, formDataValue);
            }
        );
    }

    const url = UrlConstants.PRODUCTS.SAVE_DISCOUNTED;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        discountedProductsFormDataBody,
    );
};


export const searchProducts = async (limit, PageNumber, searchvalue) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
        q: searchvalue,
    };
    const searchProductsFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.VIEW;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        searchProductsFormDataBody,
    );
};


export const searchProductsByName = async (searchvalue) => {
    const formDataPair = {
        name: searchvalue,
    };
    const searchProductsByNameFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.SEARCH;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        searchProductsByNameFormDataBody,
    );
};


export const deleteProduct = async (productId) => {
    const formDataPair = {
        id: productId
    };
    const deleteProductFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.DELETE_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        deleteProductFormDataBody //body
    );
};

export const editProduct = async (productEditData) => {

    const editProductFormDataBody = ApiCallUtil.constructFormData(productEditData);
    const url = UrlConstants.PRODUCTS.EDIT_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        editProductFormDataBody //body
    );
};

export const getProduct = async (productId) => {
    const formDataPair = {
        id: productId
    };
    const getProductFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.GET_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getProductFormDataBody //body
    );
};

export const imageUpload = async (productImg) => {
    const formDataPair = {
        image: productImg
    };
    const imageUploadFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.IMG_UPLOAD;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        imageUploadFormDataBody //body
    );
};



export const getProductMovementReport = async (productId) => {
    const formDataPair = {
        id: productId
    };
    
    const producttMovementReportFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.GET_MOVEMENT_REPORT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        producttMovementReportFormDataBody //body
    );
};




export const createComplexAddFormData =  (addProductData) => {

    const addProductFormDataBody = new FormData();


    Object.entries(addProductData).forEach(
        ([objKey, objValue]) => {

            console.log(objKey);

            /////////////chec entries///////////////
            if (objKey === "varData") {

                objValue.forEach(
                    (varDataItem, varDataIndex) => {

                        Object.entries(varDataItem).forEach(
                            ([varDataItemEntriesKey, varDataItemEntriesObjValue]) => {

                                if (varDataItemEntriesKey === "outletInfo") {

                                    varDataItemEntriesObjValue.forEach(
                                        (outletItem, outletIndex) => {

                                            Object.entries(outletItem).forEach(
                                                ([outletItemEntriesKey, outletItemEntriesValue]) => {

                                                    addProductFormDataBody.append(`varData[${varDataIndex}]outletInfo[${outletIndex}][${outletItemEntriesKey}]`, outletItemEntriesValue);  //inner level basic

                                                })

                                        })

                                }

                                else if (varDataItemEntriesKey === "qty") {

                                    varDataItemEntriesObjValue.forEach(
                                        (qtyItem, qtyIndex) => {

                                            Object.entries(qtyItem).forEach(
                                                ([qtyItemEntriesKey, qtyItemEntriesValue]) => {

                                                    addProductFormDataBody.append(`varData[${varDataIndex}]qty[${qtyIndex}][${qtyItemEntriesKey}]`, qtyItemEntriesValue);  //inner level basic

                                                })

                                        })

                                }

                                else {
                                    addProductFormDataBody.append(`varData[${varDataIndex}][${varDataItemEntriesKey}]`, varDataItemEntriesObjValue);  //inner level basic

                                }
                            })


                    }); /**end of foreach */

            }

            else if (objKey == "open_qty") {


                objValue.forEach(
                    (openQtyItem, openQtyItemIndex) => {


                        Object.entries(openQtyItem).forEach(
                            ([openQtyItemItemEntriesKey, openQtyItemItemEntriesValue]) => {


                                addProductFormDataBody.append(`open_qty[${openQtyItemIndex}][${openQtyItemItemEntriesKey}]`, openQtyItemItemEntriesValue);  //inner level basic

                            })

                    })
            }

            else {

                addProductFormDataBody.append(objKey, objValue); //root level main

            }

            //////////////////check entries//////////
        }
    );


    //console.log(addProductFormDataBody);


    return addProductFormDataBody;



};

