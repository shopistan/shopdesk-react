
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const viewOutlets = async () => {
 
  const url = UrlConstants.OUTLETS.VIEW;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};

export const viewUsers = async () => {
 
  const url = UrlConstants.OUTLETS.VIEW_USERS;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


export const viewTemplates = async () => {
 
  const url = UrlConstants.OUTLETS.VIEW_TEMPLATES;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};



