import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import * as SuppliersApiUtil from "../../../../utils/api/suppliers-api-utils";

const SupplierAdd = () => {
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  var mounted = true;


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    console.log("Success:", values);
    const hide = message.loading('Saving Changes in progress..', 0);
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
      message.error(supplierAddResponse.errorMessage, 3);
      setButtonDisabled(false);
      setTimeout(hide, 1500);
    } else {
      console.log("res -> ", supplierAddResponse.message);
      if (mounted) {     //imp if unmounted
        message.success(supplierAddResponse.message, 3);
        setTimeout(hide, 1500);
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


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1>New Supplier</h1>
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
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Tax ID"
                  name="tax"
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
