

import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';
//import $ from 'jquery';


export const getSalesHistory = async (pageLimit, pageNumber, limitCheck, startDate, finishDate) => {

    const formDataPair = {
        limit: pageLimit,
        page: pageNumber,
        startDate: startDate,
        finishDate: finishDate,

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


export const getCurrentInvoiceNumber = async () => {

    const url = UrlConstants.SALES.GET_INVOICE_NUMBER;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
      
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


export const getStoreId = async () => {

    const url = UrlConstants.SALES.GET_STORE;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};
  
  
export const exportParkedSalesInvoices = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+'?'+ query;
    const headers = {
        'Authorization': ApiCallUtil.getUserAuthToken(),
    };

    return await axios.get(url, {
        headers: headers
    })
        .then(async (res) => {
            console.log('Parked Sales Invoices Export Data Response -> ', res);
            return { hasError: false, message: "Parked Sales Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};







