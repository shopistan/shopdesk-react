import React from "react";
import { Form, Input, Button, InputNumber } from "antd";

const TaxAdd = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h2>New Tax</h2>
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
                  label='Tax Name'
                  name='tax_name'
                  rules={[
                    {
                      required: true,
                      message: "Please input tax name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Tax Percentage'
                  name='tax_percentage'
                  rules={[
                    {
                      required: true,
                      message: "Please input tax percentage",
                    },
                  ]}
                >
                  <InputNumber
                    defaultValue={100}
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace("%", "")}
                    className='u-width-100'
                  />
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
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

export default TaxAdd;
