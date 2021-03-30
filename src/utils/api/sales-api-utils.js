

import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import $ from 'jquery';


export const getSalesHistory = async (pageLimit, pageNumber, limitCheck) => {

    const formDataPair = {
        limit: pageLimit,
        page: pageNumber,
    };

    const salesHistoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SALES.VIEW_HISTORY + `?limit=${limitCheck}`;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        salesHistoryFormDataBody //body
    );
};



export const getSalesInvoiceHistory = async (invoiceId) => {
    const formDataPair = {
        invoice_id: invoiceId,
    };

    const getSalesInvoiceHistoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SALES.GET_SALE_HISTORY;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getSalesInvoiceHistoryFormDataBody //body
    );

};



export const registerInvoice = async (invoiceQueue) => {
    const registerInvoiceDataBody = {
        dataArray: invoiceQueue,
    };
    
    //const registerInvoiceFormDataBody =  $.param(registerInvoiceFormData);
    const url = UrlConstants.SALES.REGISTER_INVOICE;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = {'Content-Type': 'application/json'};

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        registerInvoiceDataBody, //body
        headers,
    );

};



