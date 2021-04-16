

import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import $ from 'jquery';



export const getAllOmniSales = async (pageLimit, pageNumber) => {

    const formDataPair = {
        limit: pageLimit,
        page: pageNumber,
    };

    const omniSalesOrdersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.ECOMMERCE.GET_ALL_OMNI_SALES;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        omniSalesOrdersFormDataBody //body
    );
};



export const getOeSaleOrderData = async (InvoiceId) => {
    const formDataPair = {
        invoice_id: InvoiceId
    };

    const getOeSalesOrdersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.ECOMMERCE.VIEW_OE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getOeSalesOrdersFormDataBody //body
    );
};



export const confirmOeSalesOrders = async (confirmedOeSalesOrder) => {

    const confirmOeSalesOrdersFormDataBody = $.param({ invoices: confirmedOeSalesOrder});
    const url = UrlConstants.ECOMMERCE.CONFIRM_OE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        confirmOeSalesOrdersFormDataBody //body
    );
};



export const cancelOeSalesOrders = async (canceledOeSaleOrder) => {

    const cancelOeSalesOrdersFormDataBody = $.param({ invoices: canceledOeSaleOrder});
    const url = UrlConstants.ECOMMERCE.CANCEL_OE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        cancelOeSalesOrdersFormDataBody //body
    );
};




export const getOmniAlInventorySync = async (limit, PageNumber) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
    };

    const getOmniAlInventorySyncFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.ECOMMERCE.GET_ALL_INVENTORY_SYNC;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getOmniAlInventorySyncFormDataBody //body
    );
};



export const getOmniInventoryDump = async () => {

    const url = UrlConstants.ECOMMERCE.GET_INVENTORY_DUMP;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};



export const fetchOeSalesOrders = async () => {

    const url = UrlConstants.ECOMMERCE.GET_OE_SALE_ORDERS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};





