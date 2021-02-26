const BASE_URL = 'https://shopdesk-develop-iiqzqqotsq-uc.a.run.app';
const urls = {
  BASE_URL,
  AUTH: {
    LOGIN: BASE_URL + '/api/users/login',
    SIGNUP: BASE_URL + '/api/users/signupl'
  },
  TAX: {
    ADD_TAX: BASE_URL + '/api/taxes/add',
    DELETE_TAX: BASE_URL + '/api/taxes/delete',
    EDIT_TAX: BASE_URL + '/api/taxes/edit'
  },
  CATEGORIES: {
    VIEW: BASE_URL + '/api/categories/view',
    ADD_CATEGORY: BASE_URL + '/api/categories/add',
    EDIT_CATEGORY: BASE_URL + '/api/categories/edit',
    DELETE_CATEGORY: BASE_URL + '/api/categories/delete'
  },
  SUPPLIERS: {
    VIEW: BASE_URL + '/api/suppliers/view',
    ADD_SUPPLIER: BASE_URL + '/api/suppliers/add',
    EDIT_SUPPLIER: BASE_URL + '/api/suppliers/edit',
    DELETE_SUPPLIER: BASE_URL + '/api/suppliers/delete'
  },
  OULETS: {
    SELECT_OUTLET: BASE_URL + '/api/users/selectStore'
  },
  COURIERS: {
    VIEW: BASE_URL + '/api/couriers/view',
    ADD_COURIER: BASE_URL + '/api/couriers/add',
    EDIT_COURIER: BASE_URL + '/api/couriers/edit',
    DELETE_COURIER: BASE_URL + '/api/couriers/delete'
  },
  CUSTOMERS: {
    VIEW: BASE_URL + '/api/customers/view'
  }
};

export default urls;
