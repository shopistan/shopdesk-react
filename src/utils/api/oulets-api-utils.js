
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const selectOutlet = async (storeRandomId) => {
  const formDataPair = {
    store_random: storeRandomId,
  };
  const selectOutletFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.OULETS.SELECT_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    selectOutletFormDataBody //body
  );
};


export const viewAllOutlets = async () => {
  const url = UrlConstants.OULETS.VIEW_ALL;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
      url, //api url
      callType //calltype
  );
};


export const viewAllOutletsForStoreSelection = async () => {
  const url = UrlConstants.OULETS.VIEW_ALL_OUTLETS;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
      url, //api url
      callType //calltype
  );
};



