import axios from 'axios';
import { getDataFromLocalStorage } from '../local-storage/local-store-utils';
import { API_ENDPOINT } from './config';


//axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
//axios.defaults.xsrfCookieName = "csrftoken";
//axios.defaults.withCredentials = true;

const contentType = {
  json: 'application/json',
  multipart: 'multipart/form-data',
};

const errorResponseHandler = (error) => {
  if (error && error.status === 401) {
    console.log('401', error);
  } else if (error && error.status === 403) {
    console.log('403', error);
  }

  if (error) {
    throw error;
  }
};
  
const config = {

  baseURL: API_ENDPOINT,  
  headers: {
    'Content-Type':  contentType.json,
    Authorization:  `${ JSON.parse(window.localStorage.getItem('user')) &&  JSON.parse(window.localStorage.getItem('user')).auth_token }`,
  },
}

  export const get = (url) => {
    const instance = axios.create(config);
    instance.interceptors.response.use(response => response, errorResponseHandler);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await instance.get(url);
        resolve(res.data || res);
      } catch (e) {
        reject(e);
      }
    });
  }

  export const post = (url, body) => {

    const instance = axios.create(config);
    instance.interceptors.response.use(response => response, errorResponseHandler);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await instance.post(url, body);
        resolve(res.data || res);
      } catch (e) {
        reject(e);
      }
    });
  }


  export const onDelete = (url, id) => {

    const instance = axios.create(config);
    instance.interceptors.response.use(response => response, errorResponseHandler);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await instance.delete(`${url}/${id}`);
        resolve(res.data || res);
      } catch (e) {
        reject(e);
      }
    });
  }

  export const put = (url, body) => {

    const instance = axios.create(config);
    instance.interceptors.response.use(response => response, errorResponseHandler);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await instance.put(url, body);
        resolve(res.data || res);
      } catch (e) {
        reject(e);
      }
    });
  }

  export const patch = (url, body) => {

    const instance = axios.create(config);
    instance.interceptors.response.use(response => response, errorResponseHandler); 

    return new Promise(async (resolve, reject) => {
      try {
        const res = await instance.patch(url, body);
        resolve(res.data || res);
      } catch (e) {
        reject(e);
      }
    });
  }


// apply interceptor on response
axios.interceptors.response.use(response => response, errorResponseHandler);


