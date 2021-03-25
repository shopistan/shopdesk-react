
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const addSupplier = async (supplierName, supplierContactName,
    supplierPhone, supplierEmail, supplierTaxNumber) => {

    const formDataPair = {
        supplier_name: supplierName,
        supplier_contact_name: supplierContactName,
        supplier_contact_phone: supplierPhone,
        supplier_contact_email: supplierEmail,
        supplier_tax_number: supplierTaxNumber,
    };
    const addSupplierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SUPPLIERS.ADD_SUPPLIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addSupplierFormDataBody //body
    );
};


export const getSupplier = async (supplierId) => {
    const formDataPair = {
        supplier_id: supplierId,
      
    };
    const getSupplierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SUPPLIERS.GET_SUPPLIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getSupplierFormDataBody //body
    );
};



export const viewSuppliers = async (limit, PageNumber) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
    };
    const viewSuppliersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SUPPLIERS.VIEW;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewSuppliersFormDataBody,
    );
};

export const viewAllSuppliers = async () => {
    
    const url = UrlConstants.SUPPLIERS.VIEW_ALL;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};

export const deleteSupplier = async (supplierId) => {
    const formDataPair = {
        supplier_id: supplierId
    };
    const deleteSupplierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SUPPLIERS.DELETE_SUPPLIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        deleteSupplierFormDataBody //body
    );
};

export const editSupplier = async (supplierId, supplierName, supplierContactName,
    supplierPhone, supplierEmail, supplierTaxNumber) => {
    const formDataPair = {
        supplier_id: supplierId,
        supplier_name: supplierName,
        supplier_contact_name: supplierContactName,
        supplier_contact_phone: supplierPhone,
        supplier_contact_email: supplierEmail,
        supplier_tax_number: supplierTaxNumber,
    };
    const editSupplierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.SUPPLIERS.EDIT_SUPPLIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        editSupplierFormDataBody //body
    );
};
