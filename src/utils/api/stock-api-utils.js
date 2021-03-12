
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
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


export const viewInventoryTransfers = async (limit, pageNumber) => {
    const formDataPair = {
        limit: limit,
        page: pageNumber,
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


