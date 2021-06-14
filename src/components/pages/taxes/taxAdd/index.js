import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import * as TaxApiUtil from "../../../../utils/api/tax-api-utils";
import { ArrowLeftOutlined } from "@ant-design/icons";


const TaxAdd = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  var mounted = true;


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    console.log("Success:", values);
    const TaxAddResponse = await TaxApiUtil.addTax(
      values.tax_name,
      values.tax_value
    );

    console.log("TaxAddResponse:", TaxAddResponse);
    if (TaxAddResponse.hasError) {
      console.log("Cant add new Tax-> ", TaxAddResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(TaxAddResponse.errorMessage, 2);
      setButtonDisabled(false);
      
    } else {
      console.log("res -> ", TaxAddResponse.message);
      if (mounted) {     //imp if unmounted
        document.getElementById('app-loader-container').style.display = "none";
        //message.success(TaxAddResponse.message, 1);
        setTimeout(() => {
          history.push({
            pathname: "/taxes",
          });
        }, 1200);
      }
    }
  };


  useEffect(() => {
    return () => {
      mounted = false;
    }
  }, []);



  const onTaxInputChange = (e) => {
    let inputTaxValue = e.target.value;
    //console.log("qty", orderQty);
    const re = /^[0-9\b]+$/;
    //console.log(re.test(e.target.value));
    if (!inputTaxValue === '' || !re.test(inputTaxValue)) {  //if contains alphabets in string
      form.setFieldsValue({
        tax_value: inputTaxValue.replace(/[^\d.]/g, '')
      });
    }

  }


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
            form={form}
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
                  <Input
                    //formatter={(e) => `${e.target.value}%`}
                    //parser={(e) => e.target.value.replace("%", "")}
                    addonAfter="%"
                    className="u-width-100"
                    onChange={onTaxInputChange}
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
