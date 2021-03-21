import GenericConstants from '../constants/constants';
import UrlConstants from '../constants/url-configs';
import * as ApiCallUtil from './generic-api-utils';

export const login = async (userNameOrEmail, passsword) => {
  const formDataPair = {
    username: userNameOrEmail,
    password: passsword
  };

  const loginFormData = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.AUTH.LOGIN;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    loginFormData //body
  );
};

export const signUp = async (
  firstName,
  email,
  password,
  confirmPassword,
  phone,
  businessName,
  businessPassword
) => {
  const formDataPair = {
    fname: firstName,
    email: email,
    password: password,
    repassword: confirmPassword,
    phone: phone,
    businessName: businessName,
    businessAddress: businessPassword
  };

  const signUpFormData = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.AUTH.SIGNUP;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    signUpFormData //body
  );
};

// const login = async (userNameOrEmail, passsword) => {
//   const loginFormData = new FormData();
//   loginFormData.append('username', userNameOrEmail);
//   loginFormData.append('password', passsword);

//   try {
//     const loginCall = await axios({
//       method: 'post',
//       url: UrlConstants.AUTH.LOGIN,
//       data: loginFormData
//     });

//     const loginResponse = loginCall.data;
//     console.log('login response is: ', loginResponse);

//     if (loginResponse && loginResponse.status) {
//       return {
//         hasError: false,
//         data: loginResponse
//       };
//     }
//     return {
//       hasError: true,
//       errorMessage: loginResponse.messsage || 'Invalid Credentials'
//     };
//   } catch (err) {
//     console.log('unable to login due to ', err);
//     return {
//       hasError: true,
//       errorMessage: 'Invalid Credentials'
//     };
//   }
// };
