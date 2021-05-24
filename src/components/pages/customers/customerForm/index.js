import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  getSingleCustomer,
  updateUserDetails,
  addCustomer,
} from '../../../../utils/api/customer-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect } from 'react';

const CustomerForm = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  //console.log(props);
  //console.log("hsitory-object",history);

  const { match = {} } = props;
  const { customer_id = {} } =  match.params;

  //These are used to set data in the ant form
  const [customerDataFields, setCustomerDataFields] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const isEditMode = props.isCustomerEditMode;



  useEffect(() => {
    if (isEditMode) {
      fetchSingleCustomerData(customer_id);
    }
  }, []);

  const fetchSingleCustomerData = async (customerId) => {
    if (!customerId) {
      return popPage();
    }
    document.getElementById('app-loader-container').style.display = "block";
    const singleCustomerDataResponse = await getSingleCustomer(customerId);

    if (singleCustomerDataResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      return popPage();
    }
    const customerData = singleCustomerDataResponse.customer;

    const mappedCustomerResponse = {
      balance: customerData.balance,
      code: customerData.customer_code,
      email: customerData.customer_email,
      name: customerData.customer_name,
      phone: customerData.customer_phone,
      gender: customerData.customer_sex,
      id: customerData.id
    };
    setCustomerData(mappedCustomerResponse);

    const fieldsForAntForm = [
      {
        name: ['customer_name'],
        value: mappedCustomerResponse.name
      },
      {
        name: ['email'],
        value: mappedCustomerResponse.email
      },
      {
        name: ['gender'],
        value: mappedCustomerResponse.gender
      },
      {
        name: ['code'],
        value: mappedCustomerResponse.code || " "
      },
      {
        name: ['phone'],
        value: mappedCustomerResponse.phone
      }
    ];

    setCustomerDataFields(fieldsForAntForm);
    document.getElementById('app-loader-container').style.display = "none";
  };

  const popPage = () => {
    history.goBack();
  };


  /*const goToPage = (url) => {
    history.push(url);
  };*/
  

  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    const updatedCustomerData = {
      name: values.customer_name,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      code: values.code,
      id: customerData.id
    };
    try {

      if (isEditMode) {
        document.getElementById('app-loader-container').style.display = "block";
        const hide = message.loading('Saving Changes in progress..', 0);
        const userDataUpdateResponse = await updateUserDetails(
          updatedCustomerData
        );
        //console.log(userDataUpdateResponse);
        if (userDataUpdateResponse.hasError) {
          console.log('Cant Edit Customer -> ', userDataUpdateResponse.errorMessage);
          message.error(userDataUpdateResponse.errorMessage, 3);
          setButtonDisabled(false);
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(hide, 1000);
        }
        else {
          setTimeout(hide, 1000);
          console.log('res -> ', userDataUpdateResponse);
          message.success(userDataUpdateResponse.message, 3);
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(() => {
            history.push({
              pathname: `/customers/${customer_id}/view`,
            });
          }, 1500);
        }

      }  /*---end of if---*/
      else {
        const addCustomerData = {
          name: values.customer_name,
          email: values.email,
          phone: values.phone,
          gender: values.gender,
          code: values.code,
          balance: values.balance,
        };
        document.getElementById('app-loader-container').style.display = "block";
        const hide = message.loading('Saving Changes in progress..', 0);
        const userDataAddResponse = await addCustomer(addCustomerData);
        //console.log(userDataAddResponse);
        if (userDataAddResponse.hasError) {
          console.log('Cant Edit Customer -> ', userDataAddResponse.errorMessage);
          message.error(userDataAddResponse.errorMessage, 3);
          document.getElementById('app-loader-container').style.display = "none";
          setButtonDisabled(false);
          setTimeout(hide, 1000);
        }
        else {
          setTimeout(hide, 1000);
          console.log('res -> ', userDataAddResponse);
          message.success(userDataAddResponse.message, 3);
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(() => {
            history.push({
              pathname: '/customers',
            });
          }, 1500);
        }

      } /*---end of else---*/
      
    } catch (err) {
      message.err('Unable to update user', 3);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  
  const onPhoneChange = (e) => {
    let phoneNumber = e.target.value;
    const re = /^[0-9\b]+$/;
    console.log(e.target.value);
    if (!e.target.value === '' || !re.test(e.target.value)) {  //if contains alphabets in string
      form.setFieldsValue({
        phone: phoneNumber.replace(/[^\d.-]/g, '')
      });
    }

  }

  const handleCancel = () => {
    history.push({
      pathname: '/customers',
    });
  };



  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>
          <Button type="primary" shape="circle" className="back-btn"
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel} />{isEditMode ? 'Edit' : 'New'} Customer</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
            form={form}
            name='basic'
            layout='vertical'
            fields={customerDataFields}
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Customer Name'
                  name='customer_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input customer name!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Phone Number'
                  name='phone'
                  rules={[
                    {
                      required: true,
                      message: 'Please input valid phone!'
                    }
                  ]}
                >
                  <Input  onChange={onPhoneChange} />
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Email Address'
                  name='email'
                  rules={[
                    {
                      required: true,
                      message: 'Please input valid email!',
                      type: "email",
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Gender'
                  name='gender'
                  rules={[
                    {
                      required: true,
                      message: 'Please input valid phone!'
                    }
                  ]}
                >
                  <Select onChange={handleChange}>
                    <Option value='male'>Male</Option>
                    <Option value='female'>Female</Option>
                    <Option value='other'>Other</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className='form__row'>
              {/* HIDE 'OPENING BALANCE' in edit mode */}
              {isEditMode ? (
                ''
              ) : (
                <div className='form__col'>
                  <Form.Item
                    label='Opening Balance'
                    name='balance'
                    rules={[
                      {
                        required: false,
                        message: 'Please input Balance'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              )}

              <div className='form__col'>
                <Form.Item
                  label='Code'
                  name='code'
                  rules={[
                    {
                      required: false,
                      message: 'Please input Code!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              {isEditMode ? <div className='form__col'></div> : ''}
            </div>
            <div className='form__row--footer'>
              <Button type='secondary' onClick={history.goBack}>
                Cancel
              </Button>

              <Button type='primary' htmlType='submit' disabled={buttonDisabled}>
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
