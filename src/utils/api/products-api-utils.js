import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const addProduct = async (productName) => {
    const formDataPair = {
        
    };
    const addproductFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.ADD_PRODUCT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addproductFormDataBody //body
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

export const searchProducts = async (limit, PageNumber, searchvalue) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
        q: searchvalue,
    };
    const searchProductsFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.PRODUCTS.SEARCH;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        searchProductsFormDataBody,
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

