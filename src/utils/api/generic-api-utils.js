import axios from 'axios';

export const http = async (
  apiUrl,
  callType,//POST or GET
  data,
  fallbackErrorMessage = 'Unable to fulfill the request'
) => {
  try {
    const axiosCallObject = {
      method: callType,
      url: apiUrl,
      data: data
    };

    const axiosCallResponse = await axios(axiosCallObject);

    if (axiosCallResponse && axiosCallResponse.status) {
      return {
        hasError: false,
        ...axiosCallResponse
      };
    }

    return {
      hasError: true,
      errorMessage: axiosCallResponse.message || fallbackErrorMessage
    };
  } catch (err) {
    console.log('error while calling api', err);
    return {
      hasError: true,
      fallbackErrorMessage
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
