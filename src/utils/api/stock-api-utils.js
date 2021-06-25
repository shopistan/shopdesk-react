
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';
import $ from 'jquery';


export const viewPurchaseOrders = async (limit, pageNumber) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber,
    };

    const viewPurchaseOrdersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewPurchaseOrdersFormDataBody,  //body
    );
};


export const addReceivePurchaseOrder = async (receivePoData) => {
    const addReceivedPoFormDataBody = {
        grn: receivePoData,
    };

    //const addReceivedPoFormDataBody =  $.param({grn: receivePoData});
    const url = UrlConstants.STOCK.ADD_RECEIVE_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;
    const headers = { 'Content-Type': 'application/json' };

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addReceivedPoFormDataBody,  //body
        headers,
    );
};


export const addPurchaseOrder = async (addPurchaseOrderData) => {
    const addPurchaseOrderFormData = {
        purchase: addPurchaseOrderData,
    };

    const addPurchaseOrderFormDataBody =  $.param(addPurchaseOrderFormData);
    const url = UrlConstants.STOCK.ADD_PURCHASE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addPurchaseOrderFormDataBody,  //body
    );
};


export const closePurchaseOrder = async (closePurchaseOrderId) => {
    const formDataPair = {
        purchase_order_id: closePurchaseOrderId,
    };

    const closePurchaseOrderFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.CLOSE_PURCHASE_ORDER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        closePurchaseOrderFormDataBody,  //body
    );
};


export const downloadPoForm = async () => {

    const url = UrlConstants.STOCK.DOWNLOAD_PO_FORM;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};



export const receivePurchaseOrder = async (purchaseOrderId) => {
    const formDataPair = {
        purchase_order_id: purchaseOrderId,
    };

    const getPurchaseOrderFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.RECEIVE_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getPurchaseOrderFormDataBody,  //body
    );
};


export const receiveCompletedPurchaseOrder = async (purchaseOrderId) => {
    const formDataPair = {
        purchase_order_id: purchaseOrderId,
    };

    const getPurchaseOrderFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.RECEIVE_COMPLETED_PO;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getPurchaseOrderFormDataBody,  //body
    );
};


export const receiveTransfer = async (receiveTransferId) => {
    const formDataPair = {
        transfer_id: receiveTransferId,
    };

    const receiveTransferFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.RECEIVE_TRANSFER_IN;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        receiveTransferFormDataBody,  //body
    );
};


export const addReceiveTransfersStatus = async (addReceiveTransferStatusData) => {

    const addReceiveTransferStatusFormDataBody = ApiCallUtil.constructFormData(
        addReceiveTransferStatusData
    );
    const url = UrlConstants.STOCK.CLOSE_TRANSFER_STATUS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addReceiveTransferStatusFormDataBody,  //body
    );
};

export const closeTransferInventoryOrder = async (closeTransferInventoryId) => {
    const formDataPair = {
        transfer_id: closeTransferInventoryId,
    };

    const closeTransferInventoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.CLOSE_TRANSFER_STATUS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        closeTransferInventoryFormDataBody,  //body
    );
};

export const returnStock = async (returnStockData) => {
    const returnStockFormData = {
        return: returnStockData,
    };

    const returnStockFormDataBody =  $.param(returnStockFormData);
    const url = UrlConstants.STOCK.RETURN_STOCK;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        returnStockFormDataBody,  //body
    );
};


export const viewStockAdjustments = async (limit, pageNumber) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber,
    };

    const viewStockAdjustmentsFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_ADJUSTMENTS;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockAdjustmentsFormDataBody, //body
    );
};


export const viewStockReturned = async (limit, pageNumber) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber,
    };

    const viewStockReturnedFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_RETURNED_STOCK;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockReturnedFormDataBody, //body
    );
};



export const viewStockReturnedDataByReturnId = async (returnId) => {
    const formDataPair = {
        return: returnId,
    };

    const viewStockReturnedByReturnIdFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.GET_STOCK_RETURNED;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewStockReturnedByReturnIdFormDataBody, //body
    );
};




export const addStockAdjustment = async (addStockAdjustmentData) => {

    const addStockAdjustmentFormDataBody =  $.param(addStockAdjustmentData);
    const url = UrlConstants.STOCK.ADD_ADJUSTMENT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addStockAdjustmentFormDataBody,  //body
    );
};


export const viewInventoryTransfers = async (limit, pageNumber, startDate, finishDate) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber, 
        startDate: startDate,
        finishDate: finishDate,
    };

    const viewInventoryTransfersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.STOCK.VIEW_TRANSFER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewInventoryTransfersFormDataBody, //body
    );

};


export const transferInventory = async (transferInventoryData) => {
    const  transferInventoryFormData = {
        transfer: transferInventoryData,
    };

    const transferInventoryFormDataBody =  $.param(transferInventoryFormData);
    const url = UrlConstants.STOCK.TRANSFER_OUT;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        transferInventoryFormDataBody, //body
    );

};



export const exportInventoryTransfers = async (params) => {

    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    

    //const url = UrlConstants.SALES.EXPORT_INVENTORY_DUMP+`/${storeId}`;         //imp prev
    const url = UrlConstants.STOCK.EXPORT_INVENTORY_TRANSFERS+'?'+ query;
    const headers = {
        'Authorization': ApiCallUtil.getUserAuthToken(),
    };

    return await axios.get(url, {
        headers: headers
    })
        .then(async (res) => {
            console.log('Inventory Transfers Export Data Response -> ', res);
            return { hasError: false, message: "Inventory Transfers Succesfully Exported", data: res.data };

        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            return { hasError: true, errorMessage: error };

        })

};

















