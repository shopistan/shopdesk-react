import {get, post } from './index';
import ErrorObject from './ErrorObject';
import { ENDPOINTS } from './config';


export async function getCategories() {
  try {
    return await post(ENDPOINTS.CATEGORIES, {});
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function addCategory(data) {
  try {
    return await post(ENDPOINTS.CATEGORIES_ADD, data);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function editCategory(data) {
  try {
    return await post(ENDPOINTS.CATEGORIES_EDIT, data);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function deleteCategory(data) {
  try {
    return await post(ENDPOINTS.CATEGORIES_DELETE, data);
  } catch (error) {
    return new ErrorObject(error);
  }
}




