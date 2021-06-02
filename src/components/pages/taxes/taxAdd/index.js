import React, { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, message } from "antd";
import { useHistory } from "react-router-dom";
import * as TaxApiUtil from "../../../../utils/api/tax-api-utils";
import { ArrowLeftOutlined } from "@ant-design/icons";


const TaxAdd = () => {
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  var mounted = true;


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    console.log("Success:", values);
    const hide = message.loading('Saving Changes in progress..', 0);
    const TaxAddResponse = await TaxApiUtil.addTax(
      values.tax_name,
      values.tax_value
    );

    console.log("TaxAddResponse:", TaxAddResponse);
    if (TaxAddResponse.hasError) {
      console.log("Cant add new Tax-> ", TaxAddResponse.errorMessage);
      message.error(TaxAddResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setButtonDisabled(false);
      setTimeout(hide, 1500);
      
    } else {
      console.log("res -> ", TaxAddResponse.message);
      if (mounted) {     //imp if unmounted
        message.success(TaxAddResponse.message, 3);
        document.getElementById('app-loader-container').style.display = "none";
        setTimeout(hide, 1500);
        setTimeout(() => {
          history.push({
            pathname: "/taxes",
          });
        }, 2000);
      }
    }
  };


  useEffect(() => {
    return () => {
      mounted = false;
    }
  }, []);


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
      pathname: '/taxes',
    });
  }


  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />New Tax</h1>
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
                    disabled={buttonDisabled}
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
