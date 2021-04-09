import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  getSingleCustomer,
  updateUserDetails,
  addCustomer,
} from '../../../../utils/api/customer-api-utils';
import { useEffect } from 'react';

const CustomerForm = (props) => {
  const history = useHistory();
  const { Option } = Select;
  //console.log(props);
  //console.log("hsitory-object",history);

  const { match = {} } = props;
  const { customer_id = {} } =  match.params;

  //These are used to set data in the ant form
  const [customerDataFields, setCustomerDataFields] = useState([]);
  const [customerData, setCustomerData] = useState({});
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
    const singleCustomerDataResponse = await getSingleCustomer(customerId);

    if (singleCustomerDataResponse.hasError) {
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
        value: mappedCustomerResponse.code
      },
      {
        name: ['phone'],
        value: mappedCustomerResponse.phone
      }
    ];

    setCustomerDataFields(fieldsForAntForm);
  };

  const popPage = () => {
    history.goBack();
  };

  const goToPage = (url) => {
    history.push(url);
  };

  const onFinish = async (values) => {
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
        const userDataUpdateResponse = await updateUserDetails(
          updatedCustomerData
        );
        //console.log(userDataUpdateResponse);
        message.success(userDataUpdateResponse.message, 3);
        goToPage(`/customers/${customer_id}/view`);
      }
      else {
        const addCustomerData = {
          name: values.customer_name,
          email: values.email,
          phone: values.phone,
          gender: values.gender,
          code: values.code,
          balance: values.balance,
        };

        const userDataAddResponse = await addCustomer(addCustomerData);
        //console.log(userDataAddResponse);
        message.success(userDataAddResponse.message, 3);
        goToPage('/customers');

      }
      
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

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1> {isEditMode ? 'Edit' : 'New'} Customer</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
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
                  <Input />
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
                      message: 'Please input valid email!'
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
                        message: 'Please input valid tax ID'
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
                      required: true,
                      message: 'Please input valid email!'
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

              <Button type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
