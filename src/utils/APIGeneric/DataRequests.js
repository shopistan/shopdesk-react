import {get, post } from './index';
import ErrorObject from './ErrorObject';
import { ENDPOINTS } from './config';


export async function getCategories() {
  // energy || instantaneous || demand
  try {
    return await post(ENDPOINTS.CATEGORIES, {});
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function addCategory(data) {
  // energy || instantaneous || demand
  try {
    return await post(ENDPOINTS.CATEGORIES_ADD, data);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function editCategory(data) {
  // energy || instantaneous || demand
  try {
    return await post(ENDPOINTS.CATEGORIES_EDIT, data);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function deleteCategory(data) {
  // energy || instantaneous || demand
  try {
    return await post(ENDPOINTS.CATEGORIES_DELETE, data);
  } catch (error) {
    return new ErrorObject(error);
  }
}




