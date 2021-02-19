import axios from 'axios';
import UrlConstants from '../constants/url-configs';

export const login = async (userNameOrEmail, passsword) => {
  const loginFormData = new FormData();
  loginFormData.append('username', userNameOrEmail);
  loginFormData.append('password', passsword);

  try {
    const loginCall = await axios({
      method: 'post',
      url: UrlConstants.AUTH.LOGIN,
      data: loginFormData
    });

    const loginResponse = loginCall.data;
    console.log('login response is: ', loginResponse);

    if (loginResponse && loginResponse.status) {
      return {
        hasError: false,
        data: loginResponse
      };
    }
    return {
      hasError: true,
      errorMessage: loginResponse.messsage || 'Invalid Credentials'
    };
  } catch (err) {
    console.log('unable to login due to ', err);
    return {
      hasError: true,
      errorMessage: 'Invalid Credentials'
    };
  }
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
  const signUpFormData = new FormData();
  signUpFormData.append('fname', firstName);
  signUpFormData.append('email', email);
  signUpFormData.append('password', password);
  signUpFormData.append('repassword', confirmPassword);
  signUpFormData.append('phone', phone);
  signUpFormData.append('businessName', businessName);
  signUpFormData.append('businessAddress', businessPassword);

  try {
    const signUpCall = await axios({
      method: 'post',
      url: UrlConstants.AUTH.SIGNUP,
      data: signUpFormData
    });

    const signUpResponse = signUpCall.data;
    console.log('sign up response is: ', signUpResponse);

    if (signUpResponse && signUpResponse.status) {
      return {
        hasError: false,
        data: signUpResponse
      };
    }
    return {
      hasError: true,
      errorMessage: signUpResponse.messsage || 'Invalid Credentials'
    };
  } catch (err) {
    console.log('unable to sign up due to ', err);
    return {
      hasError: true,
      errorMessage: 'Invalid Credentials'
    };
  }
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
