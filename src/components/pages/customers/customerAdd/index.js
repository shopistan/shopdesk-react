import React from "react";
import { Form, Input, Button, Select } from "antd";

const CustomerAdd = () => {
  const { Option } = Select;

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

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
                  label='Customer Name'
                  name='customer_name'
                  rules={[
                    {
                      required: true,
                      message: "Please input customer name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Phone Number'
                  name='phone'
                  rules={[
                    {
                      required: true,
                      message: "Please input valid phone!",
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
                  label='Email Address'
                  name='email'
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

              <div className='form__col'>
                <Form.Item
                  label='Gender'
                  name='gender'
                  rules={[
                    {
                      required: true,
                      message: "Please input valid phone!",
                    },
                  ]}
                >
                  <Select onChange={handleChange}>
                    <Option value='male'>Male</Option>
                    <Option value='female'>Female</Option>
                    <Option value='other'>Other</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Opening Balance'
                  name='balance'
                  rules={[
                    {
                      required: false,
                      message: "Please input valid tax ID",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Code'
                  name='code'
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

export default CustomerAdd;
