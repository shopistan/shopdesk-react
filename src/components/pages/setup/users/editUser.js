import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    message,
    Spin,
    InputNumber,
    Row,
    Col,
    Switch,
} from "antd";
import { useHistory } from "react-router-dom";
import "../style.scss";
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import {
    ArrowLeftOutlined,
} from "@ant-design/icons";


function EditUser(props) {
    const history = useHistory();
    const [form] = Form.useForm();
    const { Option } = Select;
    const [outletsData, setOutletsData] = useState([]);
    const [selectedOutlets, setSelectedOutlets] = useState([]);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [passwordChangeSwitch, setPasswordChangeSwitch] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { user_id = {} } = match !== undefined && match.params;



    useEffect(() => {
        if (user_id !== undefined) {
            fetchUserData(user_id);
            fetchOutletsData();
        }
        else {
            message.error("User Id cannot be null", 2);
            setTimeout(() => {
                history.push({
                    pathname: '/setup/users',
                    activeKey: 'users'
                });
            }, 1000);
        }

    }, []);



    const fetchOutletsData = async (pageLimit = 10, pageNumber = 1) => {
        const outletsViewResponse = await SetupApiUtil.viewAllOutlets();
        console.log('outletsViewResponse:', outletsViewResponse);

        if (outletsViewResponse.hasError) {
            console.log('Cant fetch Outlets Data -> ', outletsViewResponse.errorMessage);
            //setLoading(false);
        }
        else {
            console.log('res -> ', outletsViewResponse);
            message.success(outletsViewResponse.message, 3);
            setOutletsData(outletsViewResponse.outlets.data || outletsViewResponse.outlets);
            //setLoading(false);
        }
    }





    const fetchUserData = async (userId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getUserResponse = await SetupApiUtil.getUser(userId);
        console.log('getUserResponse :', getUserResponse);

        if (getUserResponse.hasError) {
            console.log('Cant fetch Outlets Data -> ', getUserResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', getUserResponse);
            message.success(getUserResponse.message, 3);
            /*--setting selected stores data---*/
            var selectedStoresData = [];
            getUserResponse.store.forEach(element => {
                selectedStoresData.push(element.store_id);
            })
            setSelectedOutlets(selectedStoresData);
            /*--setting selected stores data---*/
            setUserData(getUserResponse.User);
            /*-----setting template data to fields value------*/
            form.setFieldsValue({
                name: getUserResponse.User.user_name,
                username: getUserResponse.User.user_email,
                phone: getUserResponse.User.user_phone,
                role: getUserResponse.User.user_role,
            });
            /*-----setting template data to fields value------*/
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";

        }
    }


    const checkStoreExistsInOutlets = (row) => {
        console.log(selectedOutlets);
        const index = selectedOutlets.indexOf(row.store_id);
        if (index > -1) { return true; }
        else { return false; }
    }


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

        var editUserPostData = {};
        editUserPostData.user_id = userData.user_id;
        editUserPostData.user_name = formValues.name;
        editUserPostData.user_email = formValues.username;
        editUserPostData.change_password = passwordChangeSwitch;
        if (passwordChangeSwitch) {
            editUserPostData.password = formValues.password;
            editUserPostData.repass = formValues.re_password;
        }
        editUserPostData.user_phone = formValues.phone;
        editUserPostData.user_role = formValues.role;
        editUserPostData.outlets = selectedOutlets;


        if (buttonDisabled === false) {
            setButtonDisabled(true);}
        
        document.getElementById('app-loader-container').style.display = "block";
        const hide = message.loading('Saving Changes in progress..', 0);
        const editUserResponse = await SetupApiUtil.editUser(editUserPostData);
        console.log('addUserResponse:', editUserResponse);

        if (editUserResponse.hasError) {
            console.log('Cant Edit User -> ', editUserResponse.errorMessage);
            message.error(editUserResponse.errorMessage, 3);
            document.getElementById('app-loader-container').style.display = "none";
            setButtonDisabled(false);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', editUserResponse);
            message.success(editUserResponse.message, 3);
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


    const handlePasswordSwitch = (checked) => {
        setPasswordChangeSwitch(checked);
    };


    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };



    return (
        <div className="page dashboard">
            
            <div className="page__header">
                <h1><Button type="primary" shape="circle" className="back-btn"
                    style={{ marginRight: "2rem" }}
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel}
                /> Edit User
                </h1>
            </div>
            

            {!loading &&
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
                                    <Input className='user-email-disabled' disabled />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="form__section__header password-change-switch-row">
                            <div className="switch__row">
                                <Switch
                                    className="password-change-check"
                                    //defaultChecked
                                    onChange={handlePasswordSwitch}
                                />
                                <h3>Do you want to change password?</h3>

                            </div>
                        </div>

                        {passwordChangeSwitch &&
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
                        }

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
                                    <InputNumber className='u-width-100' />

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
                                            outletsData.map((obj, index) => {
                                                return (
                                                    <div key={obj.store_id}>
                                                        <label key={obj.store_id} className="outlets-labels">
                                                            <input type="checkbox" key={obj.store_id}
                                                                style={{ marginRight: "1rem" }}
                                                                data-outletid={obj.store_id}
                                                                onChange={handleStoreChecked}
                                                                checked={checkStoreExistsInOutlets(obj)} />
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
                            >
                                Confirm
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>}
        </div>
    );
}

export default EditUser;
