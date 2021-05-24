import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import * as SuppliersApiUtil from "../../../utils/api/suppliers-api-utils";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";


const EditSupplier = (props) => {
  const history = useHistory();
  const [supplierDataFields, setSupplierDataFields] = useState([]);
  const [SupplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { supplier_id = {} } = match !== undefined && match.params;

  var mounted = true;

  

  useEffect(() => {
    if (supplier_id !== undefined) { getSupplier(supplier_id); }
    else {
      message.error("Supplier Id cannot be null", 2);
      setTimeout(() => {
        history.goBack();
      }, 1000);
    }

    return () => {
      mounted = false;
    }

  }, []);


  const getSupplier = async (supplierId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getSupplierResponse = await SuppliersApiUtil.getSupplier(supplierId);
    console.log('getSupplierResponse:', getSupplierResponse);
    if (getSupplierResponse.hasError) {
      console.log('Supplier Cant Fetched -> ', getSupplierResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log("res -> ", getSupplierResponse.message);
      if (mounted) {     //imp if unmounted
        message.success(getSupplierResponse.message, 2);
        const supplierData = getSupplierResponse.supplier[0];  //vvimp
        setSupplierData(supplierData);
        const fieldsForAntForm = [
          {
            name: ['supplier_name'],
            value: supplierData.supplier_name
          },
          {
            name: ['contact_person'],
            value: supplierData.supplier_contact_name
          },
          {
            name: ['phone'],
            value: supplierData.supplier_contact_phone
          },
          {
            name: ['email'],
            value: supplierData.supplier_contact_email
          },
          {
            name: ['tax'],
            value: supplierData.supplier_tax_number
          },
        ];

        setSupplierDataFields(fieldsForAntForm);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
      }

    }

  }



  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    
    document.getElementById('app-loader-container').style.display = "block";
    const hide = message.loading('Saving Changes in progress..', 0);
    const supplierEditResponse = await SuppliersApiUtil.editSupplier(
      SupplierData.supplier_id,
      values.supplier_name,
      values.contact_person,
      values.phone,
      values.email,
      values.tax
    );

    console.log("supplierEditResponse:", supplierEditResponse);
    if (supplierEditResponse.hasError) {
      console.log("Cant Edit Supplier -> ", supplierEditResponse.errorMessage);
      message.error(supplierEditResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setButtonDisabled(false);
      setTimeout(hide, 1500);
    } else {
      console.log("res -> ", supplierEditResponse.message);
      if (mounted) {     //imp if unmounted
        message.success(supplierEditResponse.message, 3);
        document.getElementById('app-loader-container').style.display = "none";
        setTimeout(hide, 1500);
        setTimeout(() => {
          history.push({
            pathname: "/suppliers",
          });
        }, 2000);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
      pathname: '/suppliers',
    });
  }
  

  return (
    <div className="page categoryAdd">
      <div className="page__header">
        <h1 className="page__title"><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Edit Supplier</h1>
      </div>


      {!loading &&
      <div className="page__content">
        <div className="page__form">
          <Form
            name="basic"
            fields={supplierDataFields}
            layout="vertical"
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
                    Edit
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>}
    </div>
  );
};

export default EditSupplier;
