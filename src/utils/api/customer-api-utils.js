import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const viewCustomers = async (page=1,all=false) => {
    const formDataPair = {
        page,
        all,
    };
    const addCourierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.CUSTOMERS.VIEW;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addCourierFormDataBody //body
    );
};