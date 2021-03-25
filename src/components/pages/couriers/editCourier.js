import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';

const EditCourier = (props) => {
    const history = useHistory();
    const [courierDataFields, setCourierDataFields] = useState([]);
    const [selectedCourierData, setSelectedCourierData] = useState({});
    const [loading, setLoading] = useState(true);
    const { match = {} } = props;
    const { courier_id = {} } = match !== undefined && match.params;



    useEffect(() => {
        if (courier_id !== undefined) { getCourier(courier_id); }
        else {
            message.error("Courier Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

    }, []);



    const getCourier = async (courierId) => {
        const getCourierResponse = await CouriersApiUtil.getCourier(courierId);
        console.log('getCourierResponse:', getCourierResponse);
        if (getCourierResponse.hasError) {
            console.log('Courier Cant Fetched -> ', getCourierResponse.errorMessage);
            setLoading(false);
        }
        else {
            message.success(getCourierResponse.message, 2);
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
            
        }
    }


    const onFinish = async (values) => {
        const hide = message.loading('Saving Changes in progress..', 0);
        const courierEditResponse = await CouriersApiUtil.editCourier(courier_id,
            values.courier_name, values.courier_code);

        console.log('courierEditResponse:', courierEditResponse);
        if (courierEditResponse.hasError) {
            console.log('Cant Edit Courier -> ', courierEditResponse.errorMessage);
            message.error('Courier Cant Edit ', 3);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', courierEditResponse);
            message.success('Courier Editing Succesfull ', 3);
            setTimeout(hide, 1500);
            setTimeout(() => {
                history.push({
                    pathname: '/couriers',
                });
            }, 2000);
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
                <h1 className='page__title'>Edit Couriers</h1>
            </div>
            <div style={{ textAlign: "center" }}>
                {loading && <Spin size="large" tip="Loading..." />}
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
                            <Button type='primary' htmlType='submit'>
                                Edit
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
