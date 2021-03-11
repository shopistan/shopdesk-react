
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import $ from 'jquery';


export const viewOutlets = async () => {

  const url = UrlConstants.SETUP.VIEW;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


export const addOutlet = async (addOutletData) => {

  const addOutletFormDataBody =  $.param({store: addOutletData});

  const url = UrlConstants.SETUP.ADD_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addOutletFormDataBody, //body
  );

};


export const editOutlet = async (editOutletData) => {

  const editOutletFormDataBody =  $.param({store: editOutletData});
  const url = UrlConstants.SETUP.EDIT_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editOutletFormDataBody, //body
  );

};


export const getOutlet = async (storeId) => {
  const formDataPair = {
    store_id: storeId,
  };

  const getOutletFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.GET_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getOutletFormDataBody, //body
  );

};


export const viewUsers = async () => {

  const url = UrlConstants.SETUP.VIEW_USERS;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


export const addUser = async (addUserData) => {

  const addUserFormDataBody =  $.param({addUser: addUserData});
  const url = UrlConstants.SETUP.ADD_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addUserFormDataBody,  //body
  );
};

export const viewTemplates = async () => {

  const url = UrlConstants.SETUP.VIEW_TEMPLATES;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};

export const getTemplate = async (templateId) => {
  const formDataPair = {
    template_id: templateId,
  };

  const getTemplateFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.GET_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getTemplateFormDataBody,  //body
  );
};


export const editTemplate = async (editTemplateData) => {

  const editTemplateFormDataBody =  $.param({template: editTemplateData});
  const url = UrlConstants.SETUP.EDIT_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editTemplateFormDataBody,  //body
  );
};


export const addTemplate = async (addTemplateData) => {

  const addTemplateFormDataBody =  $.param({template: addTemplateData});
  const url = UrlConstants.SETUP.ADD_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addTemplateFormDataBody, //body
  );
};


export const addWebHook= async (webHookName) => {
  const formDataPair = {
    url: webHookName,
  };

  const addWebHookFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.WEB_HOOKS.ADD;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addWebHookFormDataBody, //body
  );
};


export const getWebHooks = async (limit, pageNumber) => {
  const formDataPair = {
    limit: limit,
    page: pageNumber,
};
  const getWebHooksFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.WEB_HOOKS.GET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getWebHooksFormDataBody,  //body
  );
};


export const deleteWebHook = async (webHookId) => {

  const url = UrlConstants.SETUP.WEB_HOOKS.DELETE + `/${webHookId}`;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


