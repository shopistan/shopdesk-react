import axios from 'axios';
import { getDataFromLocalStorage } from '../local-storage/local-store-utils';
import Constants from '../constants/constants';

export const getUserAuthToken = () => {
  try {
    const localDataResponse = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    return localDataResponse.data.auth_token;
  } catch (err) {
    console.log('json parse',err)
    return '';//returning empty token in case not found
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
    console.log(authToken);
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
        ...axiosCallResponse.data
      };
    }
    console.log('axios call response: ', axiosCallResponse.data);

    return {
      hasError: true,
      errorMessage:
        (axiosCallResponse.data && axiosCallResponse.data.message) ||
        'Unable to complete the request'
    };
  } catch (err) {
    console.log('error while calling api', err);
    return {
      hasError: true,
      errorMessage: 'Unable to complete the request'
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
