import React from "react";

import { Form, Input, Button } from "antd";

const ProductLookup = () => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Product Lookup</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
            name='basic'
            layout='vertical'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Username'
                  name='username'
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item>
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

export default ProductLookup;
