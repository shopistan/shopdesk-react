export const ENV = 'dev'; // dev || prod
export const BASE_URL = ENV === 'dev' ? `https://cloud.shopdesk.co` : `https://cloud.shopdesk.co`; 
export const API_ENDPOINT = `${BASE_URL}`;

const BASE_ENDPOINTS = {
  url: `/api`,
};

export const ENDPOINTS = {
  CATEGORIES: `${BASE_ENDPOINTS.url}/categories/view`,
  CATEGORIES_ADD: `${BASE_ENDPOINTS.url}/categories/add`,
  CATEGORIES_EDIT: `${BASE_ENDPOINTS.url}/categories/edit`,
  CATEGORIES_DELETE: `${BASE_ENDPOINTS.url}/categories/delete`,
};
