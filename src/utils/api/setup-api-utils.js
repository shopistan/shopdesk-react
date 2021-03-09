
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import $ from 'jquery';


export const viewOutlets = async () => {

  const url = UrlConstants.OUTLETS.VIEW;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};



export const addOutlet = async (addOutletData) => {

  const addOutletFormDataBody =  $.param({store: addOutletData});

  const url = UrlConstants.OUTLETS.ADD_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addOutletFormDataBody, //body
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


export const addUser = async (addUserData) => {

  const addUserFormDataBody =  $.param({addUser: addUserData});
  const url = UrlConstants.OUTLETS.ADD_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addUserFormDataBody,  //body
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



