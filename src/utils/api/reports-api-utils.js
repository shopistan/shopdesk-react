
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';



export const viewSalesSummery = async (startDate, endDate, ecommercevalue) => {
  const formDataPair = {
    startDate: startDate,
    finishDate: endDate,
    ecommerce: ecommercevalue,
  };
  const salesSummeryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.REPORTS.SALES_SUMMARY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    salesSummeryFormDataBody //body
  );
};

export const viewCategoryWiseSalesSummery = async (startDate, endDate) => {
    const formDataPair = {
      startDate: startDate,
      finishDate: endDate,
    };
    const categoryWiseSalesSummeryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.REPORTS.CATEGORY_SALES_SUMMARY;
    const callType = GenericConstants.API_CALL_TYPE.POST;
  
    return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
      categoryWiseSalesSummeryFormDataBody //body
    );
};


export const viewPrductsInventory = async () => {
    
    const url = UrlConstants.REPORTS.INVENTORY_DUMP;
    const callType = GenericConstants.API_CALL_TYPE.POST;
  
    return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
    );
};


export const getStoreId = async () => {
    
  const url = UrlConstants.REPORTS.GET_STORE;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


export const exportInventory = async (storeId) => {
  
  const url = UrlConstants.REPORTS.EXPORT_INVENTORY_DUMP+`/${storeId}`;
  const headers = {
    'Authorization': ApiCallUtil.getUserAuthToken(),
  };

  return await axios.get(url, {
    headers: headers
  })
    .then( async (res) => {
      console.log('Inventory Dump Export Data Response -> ', res);
      return { hasError: false, message: "Inventory Succesfully Exported", data: res.data };

    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
      return { hasError: true, errorMessage: error };
      
    })

};