import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, } from "antd";
import * as TaxApiUtil from "../../../utils/api/tax-api-utils";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";


const EditTax = (props) => {
  const history = useHistory();
  const [form] = Form.useForm()
  const [taxDataFields, setTaxDataFields] = useState([]);
  const [selectedTaxData, setSelectedTaxData] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { tax_id = {} } = match !== undefined && match.params;


  var mounted = true;
  


  useEffect(() => {
    if (tax_id !== undefined) { getTax(tax_id); }
    else {
      message.error("Tax Id cannot be null", 2);
      setTimeout(() => {
        history.goBack();
      }, 1000);
    }

    return () => {
      mounted = false;
    }

  }, []);


  const getTax = async (taxId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const gettaxResponse = await TaxApiUtil.getTax(taxId);
    console.log('gettaxResponse:', gettaxResponse);
    if (gettaxResponse.hasError) {
      console.log('getTax Cant Fetched -> ', gettaxResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(gettaxResponse.errorMessage, 2);
    }
    else {
      console.log('res -> ', gettaxResponse.message);
      if (mounted) {     //imp if unmounted
        const taxData = gettaxResponse.tax[0];  //vvimp
        setSelectedTaxData(taxData);
        const fieldsForAntForm = [
          {
            name: ['tax_name'],
            value: taxData.tax_name
          },
          {
            name: ['tax_value'],
            value: taxData.tax_value
          },
        ];
        setTaxDataFields(fieldsForAntForm);
        setLoading(false);
        document.getElementById('app-loader-container').style.display = "none";
        message.success(gettaxResponse.message, 2);

      }

    }
  }


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    
    document.getElementById('app-loader-container').style.display = "block";
    const taxEditResponse = await TaxApiUtil.editTax(
      selectedTaxData.tax_id,
      values.tax_name,
      values.tax_value
    );

    console.log("taxEditResponse:", taxEditResponse);
    if (taxEditResponse.hasError) {
      console.log("Cant Edit Tax -> ", taxEditResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(taxEditResponse.errorMessage, 3);
      setButtonDisabled(false);
    } else {
      console.log("res -> ", taxEditResponse.message);
      if (mounted) {     //imp if unmounted
        document.getElementById('app-loader-container').style.display = "none";
        message.success(taxEditResponse.message, 3);
        setTimeout(() => {
          history.push({
            pathname: "/taxes",
          });
        }, 1500);
      }
    }
  };


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
    <div className="page categoryAdd">
      <div className="page__header">
        <h1 className="page__title"><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Edit Tax</h1>
      </div>
      

      {!loading &&
        <div className="page__content">
          <div className="page__form">
            <Form
              form={form}
              name="basic"
              fields={taxDataFields}
              layout="vertical"
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
                        message: "Please input Tax name!",
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
                        message: "Please input tax percentage!",
                      },
                    ]}
                  >
                  <Input
                    className="u-width-100"
                    addonAfter="%"
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
                      Save
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

export default EditTax;
