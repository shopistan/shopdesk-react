
const {REACT_APP_API_BASE_URL, REACT_APP_IMAGE_UPLOADS_URL} = process.env;
const BASE_URL = REACT_APP_API_BASE_URL || 'https://shopdeskdev.shopdev.co';
const IMAGE_UPLOADS_URL = REACT_APP_IMAGE_UPLOADS_URL || 'https://storage.googleapis.com/shopdesk-artifacts';

const urls = {
  BASE_URL,
  IMAGE_UPLOADS_URL,
  AUTH: {
    LOGIN: BASE_URL + '/api/users/login',
    SIGNUP: BASE_URL + '/api/users/signup'
  },
  TAX: {
    VIEW: BASE_URL + '/api/taxes/view',
    SEARCH: BASE_URL + '/api/taxes/search',
    VIEW_ALL: BASE_URL + '/api/taxes/viewAll',
    ADD_TAX: BASE_URL + '/api/taxes/add',
    DELETE_TAX: BASE_URL + '/api/taxes/delete',
    EDIT_TAX: BASE_URL + '/api/taxes/edit',
    GET_TAX: BASE_URL + '/api/taxes/get'
  },
  CATEGORIES: {
    VIEW: BASE_URL + '/api/categories/view',
    SEARCH: BASE_URL + '/api/categories/search',
    VIEW_ALL: BASE_URL + '/api/categories/viewAll',
    ADD_CATEGORY: BASE_URL + '/api/categories/add',
    EDIT_CATEGORY: BASE_URL + '/api/categories/edit',
    DELETE_CATEGORY: BASE_URL + '/api/categories/delete',
    GET_CATEGORY: BASE_URL + '/api/categories/get'
  },
  SUPPLIERS: {
    VIEW: BASE_URL + '/api/suppliers/view',
    SEARCH: BASE_URL + '/api/suppliers/search',
    ADD_SUPPLIER: BASE_URL + '/api/suppliers/add',
    EDIT_SUPPLIER: BASE_URL + '/api/suppliers/edit',
    DELETE_SUPPLIER: BASE_URL + '/api/suppliers/delete',
    VIEW_ALL: BASE_URL + '/api/suppliers/viewAll',
    GET_SUPPLIER: BASE_URL + '/api/suppliers/get',
  },
  OULETS: {
    SELECT_OUTLET: BASE_URL + '/api/users/selectStore',
    VIEW_ALL: BASE_URL + '/api/stores/viewAll',
    VIEW_ALL_OUTLETS: BASE_URL + '/api/stores/viewAllOutlets',
  },
  COURIERS: {
    VIEW: BASE_URL + '/api/couriers/view',
    SEARCH: BASE_URL + '/api/couriers/search',
    VIEW_ALL: BASE_URL + '/api/couriers/viewAll',
    ADD_COURIER: BASE_URL + '/api/couriers/add',
    EDIT_COURIER: BASE_URL + '/api/couriers/edit',
    DELETE_COURIER: BASE_URL + '/api/couriers/delete',
    GET_COURIER: BASE_URL + '/api/couriers/get',
  },
  CUSTOMERS: {
    VIEW: BASE_URL + '/api/customers/view',
    VIEW_SINGLE: BASE_URL + '/api/customers/get',
    EDIT_CUSTOMER: BASE_URL + '/api/customers/edit',
    ADD_CUSTOMER: BASE_URL + '/api/customers/add',
    RECHARGE: BASE_URL + '/api/customers/recharge',
    CREDIT_HISTORY: BASE_URL + '/api/customers/credit',
    SEARCH: BASE_URL + '/api/customers/search',
    DELETE: BASE_URL + '/api/customers/delete',
    EXPORT: BASE_URL + '/api/customers/export_customers',
    GET_USER: BASE_URL + '/api/customers/get_user_id',
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
    BULK_UPLOAD: BASE_URL + '/api/integrations/add_products',
    GET_MOVEMENT_REPORT: BASE_URL + '/api/reports/productMovementReport',
    GET_FULL_REGISTERED_PRODUCTS: BASE_URL + '/api/products/getFullRegister',

  },
  REPORTS: {
    SALES_SUMMARY: BASE_URL + '/api/reports/saleSummary',
    CATEGORY_SALES_SUMMARY: BASE_URL + '/api/reports/categoryWiseReport',
    INVENTORY_DUMP: BASE_URL + '/api/reports/inventoryReport',
    EXPORT_INVENTORY_DUMP: BASE_URL + '/api/reports/inventoryReportCsv',
    GET_STORE: BASE_URL + '/api/reports/get_store_id',
    IMPORT_SALES_SUMMARY: BASE_URL + '/api/reports/saleSummaryCsv',
    IMPORT_SALES_OMNI_SUMMARY: BASE_URL + '/api/reports/saleSummaryOmniCsv',

  },
  SETUP: {
    VIEW: BASE_URL + '/api/stores/view',
    VIEW_ALL: BASE_URL + '/api/stores/viewAll',
    VIEW_USERS: BASE_URL + '/api/users/viewUsers',
    VIEW_TEMPLATES: BASE_URL + '/api/templates/view',
    VIEW_ALL_TEMPLATES: BASE_URL + '/api/templates/viewAll',
    ADD_OUTLET: BASE_URL + '/api/stores/add',
    GET_OUTLET: BASE_URL + '/api/stores/get',
    EDIT_OUTLET: BASE_URL + '/api/stores/edit',
    ADD_USER: BASE_URL + '/api/users/addUser',
    GET_USER: BASE_URL + '/api/users/getUser',
    GET_USERNAME: BASE_URL + '/api/users/getUsername',
    EDIT_USER: BASE_URL + '/api/users/editUser',
    ADD_TEMPLATE: BASE_URL + '/api/templates/add',
    GET_TEMPLATE: BASE_URL + '/api/templates/get',
    EDIT_TEMPLATE: BASE_URL + '/api/templates/edit',
    DELETE_TEMPLATE: BASE_URL + '/api/templates/delete',
    WEB_HOOKS: {
      ADD: BASE_URL + '/api/stores/addWebHook',
      GET: BASE_URL + '/api/stores/getWebHooks',
      DELETE: BASE_URL + '/api/stores/deleteWebHook',
    },
    OMNI: {
      ADD_OE_KEY: BASE_URL + '/api/omni_engine/addOeKey',
    }
  },
  STOCK: {
    VIEW_PO: BASE_URL + '/api/stock_control/viewPo',
    PO_VIEW_GRN: BASE_URL + '/api/stock_control/viewGrn',
    VIEW_TRANSFER: BASE_URL + '/api/transfers/viewTransfer',
    VIEW_ADJUSTMENTS: BASE_URL + '/api/stock_control/viewAdjustment',
    VIEW_RETURNED_STOCK: BASE_URL + '/api/stock_control/viewReturnStock',
    GET_STOCK_RETURNED: BASE_URL + '/api/stock_control/getReturnStock',
    RECEIVE_PO: BASE_URL + '/api/stock_control/receivePo',
    RECEIVE_COMPLETED_PO: BASE_URL + '/api/stock_control/viewPoDetails',
    ADD_RECEIVE_PO: BASE_URL + '/api/stock_control/insertGrn',
    ADD_PURCHASE_ORDER: BASE_URL + '/api/stock_control/addPo',
    DOWNLOAD_PO_FORM: BASE_URL + '/api/omni_engine/productsku',
    ADD_ADJUSTMENT: BASE_URL + '/api/integrations/stock_adjustment',
    RETURN_STOCK: BASE_URL + '/api/stock_control/addReturn',
    TRANSFER_OUT: BASE_URL + '/api/transfers/add',
    CLOSE_PURCHASE_ORDER:  BASE_URL + '/api/stock_control/closePo',
    CLOSE_TRANSFER_STATUS: BASE_URL + '/api/transfers/status',
    RECEIVE_TRANSFER_IN:  BASE_URL + '/api/transfers/getTransfer',
    EXPORT_INVENTORY_TRANSFERS: BASE_URL + '/api/transfers/tarnsfersCsv',

  },
  SALES: {  
    VIEW_HISTORY: BASE_URL + '/api/register/view',
    GET_SALE_HISTORY: BASE_URL + '/api/register/get',
    REGISTER_INVOICE: BASE_URL + '/api/register/add',
    GET_STORE: BASE_URL + '/api/register/get_store_id',
    EXPORT_INVENTORY_DUMP: BASE_URL + '/api/register/parkedSaleReportCsv',
    GET_INVOICE_NUMBER: BASE_URL + '/api/register/getInvoiceNumber',

  },
  DASHBOARD:{
    VIEW_DATA: BASE_URL + '/api/reports/dashboard',

  },
  ECOMMERCE:{
    GET_ALL_OMNI_SALES: BASE_URL + '/api/omni_engine/all',
    VIEW_OE_ORDER: BASE_URL + '/api/omni_engine/getOe',
    CONFIRM_OE_ORDER: BASE_URL + '/api/omni_engine/confirmOe',
    CANCEL_OE_ORDER: BASE_URL + '/api/omni_engine/cancelOe',
    GET_ALL_INVENTORY_SYNC: BASE_URL + '/api/omni_engine/GetAllInventorySync',
    GET_INVENTORY_DUMP: BASE_URL + '/api/omni_engine/inventoryDump',
    GET_OE_SALE_ORDERS: BASE_URL + '/api/omni_engine/fetchSaleOrders',

  }

};

export default urls;
