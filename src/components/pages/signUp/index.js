import React from 'react';
import { signUp } from '../../../utils/api/auth-api-utils';
import { saveDataIntoLocalStorage } from '../../../utils/local-storage/local-store-utils';

import { Form, Input, Button, Checkbox } from 'antd';

// const layout = {
//   labelCol: {
//     span: 8,
//   },
//   wrapperCol: {
//     span: 16,
//   },
// };
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 16,
//   },
// };

const SignUp = () => {
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
    } else {
      const signedUpUserDetails = signUpResponse.data;
      saveDataIntoLocalStorage();
    }

    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='page signUp'>
      <div className='page__header'>
        <h1 className='page__title'>Sign Up</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
            name='basic'
            layout='vertical'
            initialValues={{
              remember: true
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
                      message: 'Please input your username!'
                    }
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
                      message: 'Invalid email!'
                    }
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
                      message: 'Please input your password!'
                    }
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
                      message: 'does not match!'
                    }
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
                      message: 'Please input your phone number!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Business Name'
                  name='businessName'
                  rules={[
                    {
                      required: true,
                      message: 'please enter valid business name!'
                    }
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
                      message: 'Please input your business address'
                    }
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
