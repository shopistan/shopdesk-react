const BASE_URL = 'https://shopdesk-develop-iiqzqqotsq-uc.a.run.app';
const urls = {
  BASE_URL,
  AUTH: {
    LOGIN: BASE_URL + '/api/users/login'
  },
  TAX: {
    ADD_TAX: BASE_URL + '/api/taxes/add',
    DELETE_TAX: BASE_URL + '/api/taxes/delete',
    EDIT_TAX: BASE_URL + '/api/taxes/edit'
  }
};

export default urls;
