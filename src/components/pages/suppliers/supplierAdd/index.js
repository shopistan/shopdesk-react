import React from "react";
import { Form, Input, Button } from "antd";

const SupplierAdd = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h2>New Supplier</h2>
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
                  label='Supplier Name'
                  name='supplier_name'
                  rules={[
                    {
                      required: true,
                      message: "Please input supplier name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Contact Person Name'
                  name='contact_person'
                  rules={[
                    {
                      required: true,
                      message: "Please input contact person name!",
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
                  label='Tax ID'
                  name='tax'
                  rules={[
                    {
                      required: true,
                      message: "Please input valid tax ID",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col form__col--button'>
                <Form.Item className='u-width-100'>
                  <Button type='primary' htmlType='submit'>
                    Add
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

export default SupplierAdd;
