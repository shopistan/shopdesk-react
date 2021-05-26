import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Spin, InputNumber, Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import "../../style.scss";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";


function UserAdd() {
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [storesData, setStoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBrandName, setUserBrandName] = useState("");
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);


  var mounted = true;


  const fetchOutletsData = async () => {
    setLoading(true);
    const outletsViewResponse = await SetupApiUtil.viewAllOutlets();
    console.log('outletsViewResponse:', outletsViewResponse);

    if (outletsViewResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', outletsViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', outletsViewResponse);
      if (mounted) {     //imp if unmounted
        //message.success(outletsViewResponse.message, 3);
        setStoresData(outletsViewResponse.outlets.data || outletsViewResponse.outlets);
        setLoading(false);
      }
    }
  }


  const getUserNameData = async () => {
    setLoading(true);
    const getUsernameResponse = await SetupApiUtil.getUsername();
    console.log('getUsernameResponse:', getUsernameResponse);

    if (getUsernameResponse.hasError) {
      console.log('Cant fetch username -> ', getUsernameResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', getUsernameResponse);
      if (mounted) {     //imp if unmounted
        setUserBrandName("@"+getUsernameResponse.username);
        setLoading(false);
      }
    }
  }


  useEffect(() => {
    fetchOutletsData();
    getUserNameData();

    return () => {
      mounted = false;
    }

  }, []);


  const onFinish = async (values) => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);

    if (formValues.password !== formValues.re_password) {
      message.error("Passwords does not match", 4);
      return;
    }
    if (selectedOutlets.length === 0) {
      message.error("please select any outlet", 4);
      return;
    }

    var addUserPostData = {};
    addUserPostData.name = formValues.name;
    addUserPostData.username = formValues.username + userBrandName;
    addUserPostData.password = formValues.password;
    addUserPostData.repass = formValues.re_password;
    addUserPostData.phone = formValues.phone;
    addUserPostData.role = formValues.role;
    addUserPostData.outlets = selectedOutlets;

    
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    
    document.getElementById('app-loader-container').style.display = "block";
    const hide = message.loading('Saving Changes in progress..', 0);
    const addUserResponse = await SetupApiUtil.addUser(addUserPostData);
    console.log('addUserResponse:', addUserResponse);

    if (addUserResponse.hasError) {
      console.log('Cant Add User -> ', addUserResponse.errorMessage);
      message.error(addUserResponse.errorMessage, 3);
      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(hide, 1500);
    }
    else {
      console.log('res -> ', addUserResponse);
      message.success(addUserResponse.message, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(hide, 1000);
      setTimeout(() => {
        history.push({
          pathname: '/setup/users',
          activeKey: 'users'
        });
      }, 2000);
    }

  };


  const handleStoreChecked = (e) => {
    let outletId = e.target.dataset.outletid;
    var outletsData = [...selectedOutlets];
    const index = outletsData.indexOf(outletId);
    console.log(index);
    if (index > -1) {
      outletsData.splice(index, 1);
      setSelectedOutlets(outletsData);
    }
    else {
      outletsData.push(outletId);  /*imp convert to string[]*/
      setSelectedOutlets(outletsData);
    }

  }


  const handleCancel = () => {
    history.push({
      pathname: '/setup/users',
      activeKey: 'users'
    });
  };


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


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



  return (
    <div className="page dashboard">
      
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          style={{ marginRight: "2rem" }}
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
        /> New User
        </h1>
      </div>

      <div className="page__content">
        <div className="page__form">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input username",
                    },
                  ]}
                >
                  <Input addonAfter={userBrandName} />
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input password!",
                    },
                  ]}
                >
                  <Input type="password" />

                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Re-Type Password"
                  name="re_password"
                  rules={[
                    {
                      required: true,
                      message: "Please input password again!",
                    },
                  ]}
                >
                  <Input type="password" />
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please Input Phone!",
                    },
                  ]}
                >
                  <Input  onChange={onPhoneChange} />

                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Role!",
                    },
                  ]}
                >
                  <Select >
                    <Option key="1" value="1">Admin</Option>
                    <Option key="2" value="2">Manager</Option>
                    <Option key="3" value="3">Cashier</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="form__row">
              <Row>
                <Col md={24}>
                  <div>
                    <label>Outlets</label><br />
                    {
                      storesData.map((obj, index) => {
                        return (
                          <div key={obj.store_id}>
                            <label key={obj.store_id} className="outlets-labels">
                              <input type="checkbox" key={obj.store_id}
                                style={{ marginRight: "1rem" }}
                                data-outletid={obj.store_id}
                                onChange={handleStoreChecked} />
                              {obj.store_name}
                            </label>
                            <br />
                          </div>
                        )
                      })
                    }
                  </div>
                </Col>
              </Row>

            </div>

            <div className="form__row--footer">
              <Button type="secondary" onClick={handleCancel}>
                Cancel
              </Button>

              <Button type="primary"
                htmlType="submit"
                disabled={buttonDisabled}
                className='custom-btn custom-btn--primary'
              >
                Add
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default UserAdd;
