import React from "react";

import { Form, Input, Button, Checkbox } from "antd";

const SignIn = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page signUp'>
      <div className='page__header'>
        <h1 className='page__title'>Sign In</h1>
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
              <Button type='primary' htmlType='submit'>
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
