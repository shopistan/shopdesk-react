import React from "react";
import { Form, Input, Button, InputNumber, message } from "antd";
import { useHistory } from "react-router-dom";
import * as TaxApiUtil from "../../../../utils/api/tax-api-utils";

const TaxAdd = () => {
  const history = useHistory();

  const onFinish = async (values) => {
    console.log("Success:", values);
    const TaxAddResponse = await TaxApiUtil.addTax(
      values.tax_name,
      values.tax_value
    );

    console.log("TaxAddResponse:", TaxAddResponse);
    if (TaxAddResponse.hasError) {
      console.log("Cant add new Tax-> ", TaxAddResponse.errorMessage);
      message.error("Tax Cannot Added ", 3);
    } else {
      console.log("res -> ", TaxAddResponse);
      message.success(TaxAddResponse.message, 3);
      setTimeout(() => {
        history.push({
          pathname: "/taxes",
        });
      }, 2000);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1>New Tax</h1>
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
                  label="Tax Name"
                  name="tax_name"
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

              <div className="form__col">
                <Form.Item
                  label="Tax Percentage"
                  name="tax_value"
                  rules={[
                    {
                      required: true,
                      message: "Please input tax percentage",
                    },
                  ]}
                >
                  <InputNumber
                    initialValues={100}
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace("%", "")}
                    className="u-width-100"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col form__col--button">
                <Form.Item className="u-width-100">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="custom-btn custom-btn--primary"
                  >
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
