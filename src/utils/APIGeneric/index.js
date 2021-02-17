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

const readFromLocalStorage = JSON.parse(getDataFromLocalStorage('user').data);

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
    Authorization: readFromLocalStorage &&`${readFromLocalStorage.auth_token}`,
     },
    }
    
const instance = axios.create(config);
instance.interceptors.response.use(response => response, errorResponseHandler);


  export const get = (url) => {
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


