import axios from 'axios';
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import ApiCallUtil from './generic-api-utils';

const addTax = async (taxName, taxValue) => {
  const formDataPair = {
    name: taxName,
    value: taxValue
  };
  const addTaxFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.TAX.ADD_TAX;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addTaxFormDataBody //body
  );
};

const deleteTax = async (taxId) => {
  const formDataPair = {
    tax_id: taxId
  };
  const deleteTaxFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.TAX.ADD_TAX;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    deleteTaxFormDataBody //body
  );
};

const editTax = async (taxId, newTaxName, newTaxValue) => {
  const formDataPair = {
    tax_id: taxId,
    name: newTaxName,
    value: newTaxValue
  };
  const editTaxFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.TAX.ADD_TAX;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editTaxFormDataBody //body
  );
};
