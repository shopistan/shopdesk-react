import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";


const EditCourier = (props) => {
    const history = useHistory();
    const [courierDataFields, setCourierDataFields] = useState([]);
    const [selectedCourierData, setSelectedCourierData] = useState({});
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const { match = {} } = props;
    const { courier_id = {} } = match !== undefined && match.params;

    var mounted = true;



    useEffect(() => {
        if (courier_id !== undefined) { getCourier(courier_id); }
        else {
            message.error("Courier Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

        return () => {
            mounted = false;
        }

    }, []);



    const getCourier = async (courierId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getCourierResponse = await CouriersApiUtil.getCourier(courierId);
        console.log('getCourierResponse:', getCourierResponse);
        if (getCourierResponse.hasError) {
            console.log('Courier Cant Fetched -> ', getCourierResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            message.success(getCourierResponse.message, 2);
            if (mounted) {     //imp if unmounted
                const courierData = getCourierResponse.courier[0];  //vvimp
                setSelectedCourierData(courierData);
                const fieldsForAntForm = [
                    {
                        name: ['courier_name'],
                        value: courierData.courier_name
                    },
                    {
                        name: ['courier_code'],
                        value: courierData.courier_code
                    },
                ];

                setCourierDataFields(fieldsForAntForm);
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
        const courierEditResponse = await CouriersApiUtil.editCourier(courier_id,
            values.courier_name, values.courier_code);

        console.log('courierEditResponse:', courierEditResponse);
        if (courierEditResponse.hasError) {
            console.log('Cant Edit Courier -> ', courierEditResponse.errorMessage);
            message.error(courierEditResponse.errorMessage, 3);
            setButtonDisabled(false);
            setTimeout(hide, 1500);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', courierEditResponse);
            if (mounted) {     //imp if unmounted
                message.success(courierEditResponse.message, 3);
                setTimeout(hide, 1500);
                document.getElementById('app-loader-container').style.display = "none";
                setTimeout(() => {
                    history.push({
                        pathname: '/couriers',
                    });
                }, 2000);
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        history.push({
            pathname: '/couriers',
        });
    };

    return (
        <div className='page categoryAdd'>
            <div className='page__header'>
                <h1 className='page__title'><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Edit Couriers</h1>
            </div>

            {!loading &&
            <div className='page__content'>
                <div className='page__form'>
                    <Form
                        name='basic'
                        fields={courierDataFields}
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <div className='form__row'>
                            <div className='form__col'>
                                <Form.Item
                                    label='Courier Name'
                                    name='courier_name'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input courier name!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='form__col'>
                                <Form.Item
                                    label='Courier Code'
                                    name='courier_code'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input courier code!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='form__row--footer'>
                            <Button type='primary' htmlType='submit' disabled={buttonDisabled}>
                                Save
                            </Button>
                            <Button
                                onClick={() => handleCancel()}>
                                Cancel
                        </Button>

                        </div>
                    </Form>
                </div>
            </div>}
        </div>
    );
};

export default EditCourier;
