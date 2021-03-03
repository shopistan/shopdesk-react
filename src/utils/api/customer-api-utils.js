import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';

export const viewCustomers = async (page = 1, all = false) => {
  const formDataPair = {
    page,
    all
  };
  const addCustomerFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.CUSTOMERS.VIEW;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addCustomerFormDataBody //body
  );
};

// api/customers/get
export const getSingleCustomer = async (customerId) => {
  const formDataPair = {
    customer_id: customerId
  };
  const singleCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.VIEW_SINGLE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    singleCustomerFormDataBody //body
  );
};

export const updateUserDetails = async (newCustomerData) => {
  const formDataPair = {
    'customer[name]': newCustomerData.name,
    'customer[email]': newCustomerData.email,
    'customer[phone]': newCustomerData.phone,
    'customer[sex]': newCustomerData.gender,
    'customer[code]': newCustomerData.code,
    'customer[id]': newCustomerData.id
  };
  const singleCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.EDIT_CUSTOMER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    singleCustomerFormDataBody //body
  );
};

export const rechargeCustomerAccount = async (customerData, paymetInfo) => {
  const formDataPair = {
    'customer[name]': customerData.name,
    'customer[email]': customerData.email,
    'customer[phone]': customerData.phone,
    'customer[sex]': customerData.gender,
    'customer[code]': customerData.code,
    'customer[id]': customerData.id,
    'customer[paymentType]': paymetInfo.type,
    'customer[amount]': paymetInfo.amount
  };
  const singleCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.RECHARGE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    singleCustomerFormDataBody //body
  );
};
