import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';


export const viewCustomers = async (limit, page = 1, all = false) => {
  const formDataPair = {
    limit,
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



export const searchCustomers = async (limit, PageNumber, searchvalue) => {

  const url = UrlConstants.CUSTOMERS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
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


export const customerCreditDetails = async (customerId) => {
  const formDataPair = {
    'customer_id': customerId,
  };
  const singleCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.CREDIT_HISTORY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    singleCustomerFormDataBody //body
  );
}



export const searchCustomer = async (searchValue) => {
  const formDataPair = {
    q: searchValue,
  }

  const searchCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.SEARCH;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    searchCustomerFormDataBody,   //body
  );
}


export const deleteCustomer = async (customerId) => {
  const formDataPair = {
    customer_id: customerId,
  }

  const deleteCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.DELETE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    deleteCustomerFormDataBody,   //body
  );
}


export const addCustomer = async (newCustomerData) => {
  const formDataPair = {
    'customer[name]': newCustomerData.name,
    'customer[email]': newCustomerData.email,
    'customer[phone]': newCustomerData.phone,
    'customer[sex]': newCustomerData.gender,
    'customer[code]': newCustomerData.code,
    'customer[balance]': newCustomerData.balance,
  };
  const addCustomerFormDataBody = ApiCallUtil.constructFormData(
    formDataPair
  );
  const url = UrlConstants.CUSTOMERS.ADD_CUSTOMER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addCustomerFormDataBody //body
  );
};


export const getUserId = async () => {
    
  const url = UrlConstants.CUSTOMERS.GET_USER;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};



export const exportCustomers = async (customerId) => {
  
  const url = UrlConstants.CUSTOMERS.EXPORT+`/${customerId}`;
  const headers = {
    'Authorization': ApiCallUtil.getUserAuthToken(),
  };

  return await axios.get(url, {
    headers: headers
  })
    .then( async (res) => {
      console.log('Customers Export Data Response -> ', res);
      return { hasError: false, message: "Customers Exported", data: res.data };

    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
      return { hasError: true, errorMessage: error };
      
    })

};




