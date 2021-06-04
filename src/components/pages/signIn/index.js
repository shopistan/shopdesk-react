import React, { useState, useEffect } from "react";

import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import { login } from "../../../utils/api/auth-api-utils";
import { saveDataIntoLocalStorage } from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";

const SignIn = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);


  var mounted = true;


  useEffect(() => {

    document.getElementById('app-loader-container').style.display = "block";
    setTimeout(() => {
      document.getElementById('app-loader-container').style.display = "none";
    }, 1000);

    return () => {
      mounted = false;
    }

  }, []);


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    //The values that will be in form data:
    //{ username: 'a', password: 'a', remember: true };

    //todo: show loader here
    document.getElementById('app-loader-container').style.display = "block";
    const loginResponse = await login(values.username, values.password);
    if (loginResponse.hasError) {
      const errorMessage = loginResponse.errorMessage;
      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(errorMessage, 3);
    } else {
      const loggedInUserDetails = loginResponse;
      if (mounted) {   //imp if unmounted
        saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loggedInUserDetails);
        document.getElementById('app-loader-container').style.display = "none";
        message.success("Login Succesfull ", 2);
        
        setTimeout(() => {
          window.open("/outlets", "_self");
        }, 2000);
      }
    }

    console.log("Success:", loginResponse);

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page signUp'>
      <div className='page__header'>
        <h1>Sign In</h1>
      </div>

      <div className='page__content'>
        <div className='page__form page__form--small'>
          <Form
            name='basic'
            layout='vertical'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label='Username'
              name='username'
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name='remember' valuePropName='checked'>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='custom-btn custom-btn--primary'
                disabled={buttonDisabled}
              >
                Submit 
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
