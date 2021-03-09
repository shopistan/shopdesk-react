import React from "react";
import { Form, Input, Button, Select, Badge } from "antd";
import { AppstoreAddOutlined, PlusCircleOutlined } from "@ant-design/icons";

function OutletEdit() {
  const { Option } = Select;

  const { Search } = Input;

  const onSearch = (value) => console.log(value);

  const [show, setShow] = React.useState(true);

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Edit Outlet</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
            name='basic'
            layout='vertical'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* Form Section */}
            <div className='form__section'>
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='Outlet Name'
                    name='outlet'
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

                <div className='form__col'>
                  <Form.Item
                    label='Currency'
                    name='currency'
                    rules={[
                      {
                        required: true,
                        message: "Please input valid phone!",
                      },
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
                <div className='form__col'>
                  <Form.Item
                    label='Receipt Template'
                    name='email'
                    rules={[
                      {
                        required: true,
                        message: "Please input valid email!",
                      },
                    ]}
                  >
                    <Select onChange={handleChange}>
                      <Option value='male'>Male</Option>
                      <Option value='female'>Female</Option>
                      <Option value='other'>Other</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Business Address'
                    name='address'
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

              <div className='form__row--footer'>
                <Button type='secondary' htmlType='submit'>
                  Cancel
                </Button>

                <Button
                  type='primary'
                  htmlType='submit'
                  className='custom-btn custom-btn--primary'
                >
                  Confirm
                </Button>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header'>
                <h2>Outlet API KEY</h2>
                <p>
                  Token Type: <Badge count={show ? 25 : 0} />
                </p>
              </div>

              <div className='form__row'>
                <div className='form__col form__col--btn'>
                  <Search
                    placeholder='input search text'
                    allowClear
                    enterButton='Copy'
                    size='large'
                    onSearch={onSearch}
                  />

                  <Button
                    type='primary'
                    icon={<AppstoreAddOutlined />}
                    className='custom-btn custom-btn--primary'
                  >
                    Generate Secret
                  </Button>
                </div>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header form__section__header--btn'>
                <h2>HTTP WebHooks</h2>

                <Button
                  type='primary'
                  icon={<PlusCircleOutlined />}
                  className='custom-btn custom-btn--primary'
                >
                  Add New
                </Button>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header form__section__header--btn'>
                <h2>Shopistan OmniEngine Settings</h2>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Outlet Name'
                  name='outlet'
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

              <div className='form__col'>
                <Form.Item
                  label='Currency'
                  name='currency'
                  rules={[
                    {
                      required: true,
                      message: "Please input valid phone!",
                    },
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

            <div className='form__row--footer'>
              <Button type='secondary' htmlType='submit'>
                Cancel
              </Button>

              <Button
                type='primary'
                htmlType='submit'
                className='custom-btn custom-btn--primary'
              >
                Confirm
              </Button>
            </div>
            {/* Form Section */}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default OutletEdit;
