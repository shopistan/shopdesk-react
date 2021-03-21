import axios from 'axios';
import {
  getDataFromLocalStorage,
  clearLocalUserData
} from '../local-storage/local-store-utils';
import Constants from '../constants/constants';

export const getUserAuthToken = () => {
  try {
    const localDataResponse = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    return localDataResponse.data.auth_token;
  } catch (err) {
    console.log('json parse', err);
    return ''; //returning empty token in case not found
  }
};

export const http = async (
  apiUrl,
  callType, //POST or GET
  data,
  headers = {}
) => {
  try {
    const authToken = getUserAuthToken();
    headers['Authorization'] = authToken;

    const axiosCallObject = {
      method: callType,
      url: apiUrl,
      data: data,
      headers
    };

    const axiosCallResponse = await axios(axiosCallObject);

    if (
      axiosCallResponse &&
      axiosCallResponse.data &&
      axiosCallResponse.data.status
    ) {
      return {
        hasError: false,
        authenticated: true,
        ...axiosCallResponse.data
      };
    }
    console.log('axios call response: ', axiosCallResponse.data);

    let isUserAuthenticated = true;
    const errorMessageResponse =
      axiosCallResponse.data && axiosCallResponse.data.message;
    if (
      errorMessageResponse &&
      errorMessageResponse === 'Authentication Failed'
    ) {
      isUserAuthenticated = false;
    }

    if (!isUserAuthenticated) {
      clearLocalUserData();
      window.location.href = '/sign-in';
    }

    return {
      hasError: true,
      errorMessage:
        (axiosCallResponse.data && axiosCallResponse.data.message) ||
        'Unable to complete the request',
      authenticated: isUserAuthenticated
    };
  } catch (err) {
    console.log('error while calling api', err);
    //as we are not sure here that cause of API failure is due to authentication
    //or something else
    //that is why we are assuming user is currently authenticated

    //Currently in api endpoints all requests are returned with 200 status
    //irrespective of their state (unauthentication or error)
    return {
      hasError: true,
      errorMessage: 'Unable to complete the request',
      authenticated: true
    };
  }
};

export const constructFormData = (objectWithKeyValuePairs) => {
  const formData = new FormData();

  Object.entries(objectWithKeyValuePairs).forEach(
    ([formDataKey, formDataValue]) => {
      formData.append(formDataKey, formDataValue);
    }
  );

  return formData;
};
