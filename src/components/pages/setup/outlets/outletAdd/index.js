
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import "../../style.scss";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import currencyData from "./currencyData.json";


function OutletAdd() {
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [loading, setLoading] = useState(true);
  const [templatesData, setTemplatesData] = useState([]);
  const [currenciesData, setCurrenciesData] = useState([]);
  const [selectedCurrencyObj, setSelectedCurrencyObj] = useState("");


  const fetchUsersTemplatesData = async (pageLimit = 50, pageNumber = 1) => {
    const userTemplatesViewResponse = await SetupApiUtil.viewTemplates(pageLimit, pageNumber);
    console.log('userTemplatesViewResponse:', userTemplatesViewResponse);

    if (userTemplatesViewResponse.hasError) {
      console.log('Cant fetch Users templates Data -> ', userTemplatesViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', userTemplatesViewResponse);
      message.success(userTemplatesViewResponse.message, 3);
      setTemplatesData(userTemplatesViewResponse.templates.data);
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchUsersTemplatesData();
    var currenciesDataArr = [...currencyData];
    console.log(currenciesDataArr);
    setCurrenciesData(currenciesDataArr);

  }, []);



  const onFinish = async (values) => {
    //console.log("Success:", values);
    var formValues = form.getFieldsValue();
    console.log("changed", formValues);

    var addOutletPostData = {};
    addOutletPostData.currency = selectedCurrencyObj;
    addOutletPostData.name = formValues.outlet;
    addOutletPostData.businessAddress = formValues.address;
    addOutletPostData.template_id = formValues.template;

    const hide = message.loading('Saving Changes in progress..', 0);
    const addOutletResponse = await SetupApiUtil.addOutlet(addOutletPostData);
    console.log('addOutletResponse:', addOutletResponse);

    if (addOutletResponse.hasError) {
      console.log('Cant Add outlet -> ', addOutletResponse.errorMessage);
      setTimeout(hide, 1500);
    }
    else {
      console.log('res -> ', addOutletResponse);
      message.success(addOutletResponse.message, 3);
      setTimeout(hide, 1000);
      setTimeout(() => {
        history.push({
          pathname: '/setup/outlets',
          activeKey: 'outlets'
        });
      }, 2000);
    }

  };


  const handleCurrencyChange = (value) => {
    var selectedCurrencyCode = value;
    const index = currenciesData.findIndex(item => selectedCurrencyCode === item.code);
    if (index > -1) {
      setSelectedCurrencyObj(currenciesData[index]);
      console.log(currenciesData[index]);
    }
    else { setSelectedCurrencyObj(""); }

  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
        pathname: '/setup/outlets',
        activeKey: 'outlets'
    });
  };



  return (
    <div className="page dashboard">
      <div style={{ textAlign: "center" }}>
        {loading && <Spin size="large" />}
      </div>
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
         icon={<ArrowLeftOutlined />} 
         onClick={handleCancel}  />
         New Outlet</h1>
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
                      message: "Please select currency!",
                    },
                  ]}
                >
                  <Select onChange={handleCurrencyChange}>
                    {
                      currenciesData.map((obj, index) => {
                        return (
                          <option key={obj.code} value={obj.code}>
                            <img className="currency-flag-img"
                              src={`/images/flags/${((obj.code).substring(0, 2)).toLowerCase()}.png`} />
                            {obj.name}
                          </option>
                        )
                      })
                    }
                  </Select>

                </Form.Item>
              </div>
            </div>


            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Receipt Template"
                  name="template"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Template!",
                    },
                  ]}
                >
                  <Select>
                  {
                        templatesData.map((obj, index) => {
                          return (
                            <option key={obj.template_id} value={obj.template_id}>
                              {obj.template_name}
                            </option>
                          )
                        })
                      }
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
                      message: "Please input address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="form__row--footer">
              <Button type="secondary" onClick={handleCancel}>
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

export default OutletAdd;
