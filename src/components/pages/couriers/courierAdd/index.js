import React from "react";
import { Form, Input, Button } from "antd";

const CourierAdd = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>New Customer</h1>
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
                  label='Courier Name'
                  name='courier_name'
                  rules={[
                    {
                      required: true,
                      message: "Please input courier name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Courier Code'
                  name='courier_code'
                  rules={[
                    {
                      required: true,
                      message: "Please input valid email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className='form__row--footer'>
              <Button type='secondary' htmlType='submit'>
                Cancel
              </Button>

              <Button type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CourierAdd;
