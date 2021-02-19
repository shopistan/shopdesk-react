import Constants from '../../utils/constants/constants';


export const saveDataIntoLocalStorage = (key, value) => {
  try {
    //window.localStorage.saveItem(key, JSON.stringify(value)); not working
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(
      'error while saving data with key',
      key,
      'and value',
      value,
      'into local storage'
    );
  }
};

export const getDataFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    hasError: dataFromLocalStorage ? true : false,
    data: dataFromLocalStorage
  };
};

export const clearDataFromLocalStorage = () => {
  localStorage.clear();
};


export const checkUserAuthFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    authentication: dataFromLocalStorage.hasOwnProperty(Constants.USER_AUTH_KEY),
  };
};