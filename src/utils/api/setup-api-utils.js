
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


export const viewAllOutlets = async () => {
  const url = UrlConstants.SETUP.VIEW_ALL;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
      url, //api url
      callType //calltype
  );
};


export const addOutlet = async (addOutletData) => {
  const addOutletFormDataBody = {
    store: addOutletData
  };

  //const addOutletFormDataBody =  $.param({store: addOutletData});
  const url = UrlConstants.SETUP.ADD_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { 'Content-Type': 'application/json' };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addOutletFormDataBody, //body
    headers,
  );

};


export const editOutlet = async (editOutletData) => {
  const editOutletFormDataBody = {
    store: editOutletData
  };

  const url = UrlConstants.SETUP.EDIT_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { 'Content-Type': 'application/json' };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editOutletFormDataBody, //body
    headers,
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

export const userLoginForNewApiKey = async (refreshToken, neverExpire) => {
  const formDataPair = {
    refresh: refreshToken,
    never_expire: neverExpire,
  };

  const LoginForNewApiKeyFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.AUTH.LOGIN;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    LoginForNewApiKeyFormDataBody , //body
  );


};

export const selectOutletForNewApiKey = async (storeRandomId) => {
  const formDataPair = {
    store_random: storeRandomId,
    type:  GenericConstants.X_API_KEY,
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


export const viewUsers = async () => {

  const url = UrlConstants.SETUP.VIEW_USERS;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


export const addUser = async (addUserData) => {
  const  addUserFormDataBody = {
    addUser: addUserData
  };
  
  const url = UrlConstants.SETUP.ADD_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { 'Content-Type': 'application/json' };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addUserFormDataBody,  //body
    headers,
  );
};


export const editUser = async (editUserData) => {
  const editUserFormDataBody = {
    user: editUserData,
  };
 
  const url = UrlConstants.SETUP.EDIT_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { 'Content-Type': 'application/json' };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editUserFormDataBody,  //body
    headers,
  );
};



export const getUser = async (userId) => {
  const formDataPair = {
    user_id: userId,
  };

  const getUserFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.GET_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getUserFormDataBody,  //body
  );
};


export const getUsername = async () => {

  const url = UrlConstants.SETUP.GET_USERNAME;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
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



export const viewAllTemplates = async () => {

  const url = UrlConstants.SETUP.VIEW_ALL_TEMPLATES;
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
  const editTemplateFormDataBody = {
    template: editTemplateData
  };

  const url = UrlConstants.SETUP.EDIT_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { 'Content-Type': 'application/json' };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editTemplateFormDataBody,  //body
    headers,
  );
};


export const deleteTemplate = async (TemplateId) => {
  const formDataPair = {
    template_id: TemplateId,
  };

  const deleteTemplateFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.DELETE_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    deleteTemplateFormDataBody,  //body
  );
};



export const addTemplate = async (addTemplateData) => {
  const addTemplateFormDataBody = {
    template: addTemplateData
  };

  const url = UrlConstants.SETUP.ADD_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { 'Content-Type': 'application/json' };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addTemplateFormDataBody, //body
    headers,
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


