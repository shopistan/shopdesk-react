
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


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