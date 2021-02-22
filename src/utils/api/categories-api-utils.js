
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';



export const addCategory = async (categoryName) => {
  const formDataPair = {
    name: categoryName,
  };
  const addCategoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.CATEGORIES.ADD_CATEGORY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addCategoryFormDataBody //body
  );
};

export const viewCategories = async (limit, PageNumber) => {
  const formDataPair = {
    limit: limit,
    page: PageNumber,
  };
    const viewCategoriesFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.CATEGORIES.VIEW;
    const callType = GenericConstants.API_CALL_TYPE.POST;
  
    return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
      viewCategoriesFormDataBody,
    );
};

export const deleteCategory = async (categoryId) => {
  const formDataPair = {
    cat_id: categoryId
  };
  const deleteCategoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.CATEGORIES.DELETE_CATEGORY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    deleteCategoryFormDataBody //body
  );
};

export const editCategory = async (categoryId, categoryName) => {
  const formDataPair = {
    cat_id: categoryId,  
    cat_name: categoryName,
  };
  const editCategoryFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.CATEGORIES.EDIT_CATEGORY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editCategoryFormDataBody //body
  );
};
