const BASE_URL = 'https://shopdesk-develop-iiqzqqotsq-uc.a.run.app';
const IMAGE_UPLOADS_URL = 'https://storage.googleapis.com/shopdesk-artifacts';

const urls = {
  BASE_URL,
  IMAGE_UPLOADS_URL,
  AUTH: {
    LOGIN: BASE_URL + '/api/users/login',
    SIGNUP: BASE_URL + '/api/users/signupl'
  },
  TAX: {
    VIEW: BASE_URL + '/api/taxes/view',
    ADD_TAX: BASE_URL + '/api/taxes/add',
    DELETE_TAX: BASE_URL + '/api/taxes/delete',
    EDIT_TAX: BASE_URL + '/api/taxes/edit',
    GET_TAX: BASE_URL + '/api/taxes/get'
  },
  CATEGORIES: {
    VIEW: BASE_URL + '/api/categories/view',
    ADD_CATEGORY: BASE_URL + '/api/categories/add',
    EDIT_CATEGORY: BASE_URL + '/api/categories/edit',
    DELETE_CATEGORY: BASE_URL + '/api/categories/delete',
    GET_CATEGORY: BASE_URL + '/api/categories/get'
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
    VIEW: BASE_URL + '/api/customers/view',
    VIEW_SINGLE: BASE_URL + '/api/customers/get',
    EDIT_CUSTOMER: BASE_URL + '/api/customers/edit',
    RECHARGE: BASE_URL + '/api/customers/recharge',
    CREDIT_HISTORY: BASE_URL + '/api/customers/credit'
  },
  PRODUCTS: {
    VIEW: BASE_URL + '/api/products/view',
    SEARCH: BASE_URL + '/api/products/search',
    VIEW_VARIANTS: BASE_URL + '/api/products/viewVar',
    LOOKUP: BASE_URL + '/api/products/lookup',
    ADD_PRODUCT: BASE_URL + '/api/products/add',
    EDIT_PRODUCT: BASE_URL + '/api/products/edit',
    DELETE_PRODUCT: BASE_URL + '/api/products/delete',
    GET_PRODUCT: BASE_URL + '/api/products/get',
    IMG_UPLOAD: BASE_URL + '/api/products/do_upload',
    GET_REGISTERED_PRODUCTS: BASE_URL + '/api/products/getRegister',
    SAVE_DISCOUNTED: BASE_URL + '/api/promotions/setSpecial',
    BULK_UPLOAD: BASE_URL + '/api/integrations/add_products'
  },
  REPORTS:{
    SALES_SUMMARY: BASE_URL + '/api/reports/saleSummary',
    CATEGORY_SALES_SUMMARY: BASE_URL + '/api/reports/categoryWiseReport',
    INVENTORY_DUMP: BASE_URL + '/api/reports/inventoryReport',

  },
  OUTLETS:{
    VIEW: BASE_URL + '/api/stores/view',
    VIEW_USERS: BASE_URL + '/api/users/viewUsers',
    VIEW_TEMPLATES: BASE_URL + '/api/templates/view', 

  }

};

export default urls;
