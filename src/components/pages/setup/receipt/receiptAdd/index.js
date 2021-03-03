import React from "react";
import { Form, Input, Button, Select } from "antd";

function ReceiptAdd() {
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
    <div className="page dashboard">
      <div className="page__header">
        <h1>New Receipt</h1>
      </div>

      <div className="page__content">
        <div className="page__form">
          <Form
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Outlet Name"
                  name="outlet"
                  rules={[
                    {
                      required: true,
                      message: "Please input outlet name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Currency"
                  name="currency"
                  rules={[
                    {
                      required: true,
                      message: "Please input valid phone!",
                    },
                  ]}
                >
                  <Select onChange={handleChange}>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Receipt Template"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input valid email!",
                    },
                  ]}
                >
                  <Select onChange={handleChange}>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Business Address"
                  name="address"
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

            <div className="form__row--footer">
              <Button type="secondary" htmlType="submit">
                Cancel
              </Button>

              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ReceiptAdd;
