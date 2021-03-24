import React from "react";
import { signUp } from "../../../utils/api/auth-api-utils";
import { saveDataIntoLocalStorage } from "../../../utils/local-storage/local-store-utils";
import { useHistory } from 'react-router-dom';

import { Form, Input, Button, message, InputNumber } from "antd";

const SignUp = () => {
  const history = useHistory();

  const onFinish = async (values) => {
    //The values that will be in form data:
    // {
    //   businessAddress: 'a',
    //   businessName: 'a',
    //   confirmPassword: 'a',
    //   email: 'a',
    //   fullName: 'a',
    //   password: 'a',
    //   phoneNumber: 'a'
    // };

    if (values.password !== values.confirmPassword) {
      message.error("Passwords does not match", 4);
      return;
    }


    const signUpResponse = await signUp(
      values.fullName,
      values.email,
      values.password,
      values.confirmPassword,
      values.phone,
      values.businessName,
      values.businessPassword
    );

    if (signUpResponse.hasError) {
      const errorMessage = signUpResponse.errorMessage;
      console.log('Cant SignUP -> ', errorMessage );
      message.error('SignUP UnSuccesfull ', 3);
    } else {
      const signedUpUserDetails = signUpResponse;
      saveDataIntoLocalStorage();
      message.success('SignUp Succesfull ', 3);
      console.log('res -> ', signedUpUserDetails );
        setTimeout(() => {
          history.push({
            pathname: '/sign-in',
          });
        }, 2000);

    }

    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page signUp'>
      <div className='page__header'>
        <h1>Sign Up</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
            name='basic'
            layout='vertical'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Full name'
                  name='fullName'
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Email'
                  name='email'
                  rules={[
                    {
                      required: true,
                      message: "Invalid email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
              <div className='form__col'>
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
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Re-type Password'
                  name='confirmPassword'
                  rules={[
                    {
                      required: true,
                      message: "does not match!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Phone Number'
                  name='phoneNumber'
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <InputNumber className='u-width-100' />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Business Name'
                  name='businessName'
                  rules={[
                    {
                      required: true,
                      message: "please enter valid business name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Business Address'
                  name='businessAddress'
                  rules={[
                    {
                      required: true,
                      message: "Please input your business address",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col form__col--button'>
                <Form.Item className='u-width-100'>
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
