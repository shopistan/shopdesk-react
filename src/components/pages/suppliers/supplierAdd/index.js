import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import * as SuppliersApiUtil from "../../../../utils/api/suppliers-api-utils";
import { ArrowLeftOutlined } from "@ant-design/icons";


const SupplierAdd = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  var mounted = true;


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    console.log("Success:", values);
    document.getElementById('app-loader-container').style.display = "block";
    const supplierAddResponse = await SuppliersApiUtil.addSupplier(
      values.supplier_name,
      values.contact_person,
      values.phone,
      values.email,
      values.tax
    );

    console.log("supplierAddResponse:", supplierAddResponse);
    if (supplierAddResponse.hasError) {
      console.log(
        "Cant add new Supplier -> ",
        supplierAddResponse.errorMessage
      );
      document.getElementById('app-loader-container').style.display = "none";
      message.error(supplierAddResponse.errorMessage, 3);
      setButtonDisabled(false);
    } else {
      console.log("res -> ", supplierAddResponse.message);
      if (mounted) {     //imp if unmounted
        document.getElementById('app-loader-container').style.display = "none";
        message.success(supplierAddResponse.message, 3);
        setTimeout(() => {
          history.push({
            pathname: "/suppliers",
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

  

  const onPhoneChange = (e) => {
    let phoneNumber = e.target.value;
    const re = /^[0-9\b]+$/;
    //console.log(re.test(e.target.value));
    if (!e.target.value === '' || !re.test(e.target.value)) {  //if contains alphabets in string
      form.setFieldsValue({
        phone: phoneNumber.replace(/[^\d.-]/g, '')
      });

    }

  }


  const onTaxChange = (e) => {
    let taxValue = e.target.value;
    const re = /^[0-9\b]+$/;
    //console.log(re.test(e.target.value));
    if (!taxValue=== '' || !re.test(taxValue)) {  //if contains alphabets in string
      form.setFieldsValue({
        tax: taxValue.replace(/[^\d.-]/g, '')
      });
    }

  }


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
      pathname: '/suppliers',
    });
  }


  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />New Supplier</h1>
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
                  label="Supplier Name"
                  name="supplier_name"
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

              <div className="form__col">
                <Form.Item
                  label="Contact Person Name"
                  name="contact_person"
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

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please input valid email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input valid phone!",
                    },
                  ]}
                >
                  <Input onChange={onPhoneChange} />
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Tax ID"
                  name="tax"
                  /*rules={[
                    {
                      //required: true,
                      //message: "Please input valid tax ID",
                    },
                  ]}*/
                >
                  <Input  className="u-width-100"  onChange={onTaxChange}  />
                </Form.Item>
              </div>

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

export default SupplierAdd;
