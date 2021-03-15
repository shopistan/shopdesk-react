import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';

const EditCourier = () => {
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect(async () => {
        //console.log(history.location.data); working
        if (history.location.data === undefined) {
            history.push({
                pathname: '/couriers',
            });
        }

    }, []);


    const onFinish = async (values) => {
        const courierEditResponse = await CouriersApiUtil.editCourier(history.location.data.courier_id,
            values.courier_name, values.courier_code);

        console.log('courierEditResponse:', courierEditResponse);
        if (courierEditResponse.hasError) {
            console.log('Cant Edit Courier -> ', courierEditResponse.errorMessage);
            message.error('Courier Cant Edit ', 3);
        }
        else {
            console.log('res -> ', courierEditResponse);
            message.success('Courier Editing Succesfull ', 3);
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

    return (
        <div className='page categoryAdd'>
            <div className='page__header'>
                <h1 className='page__title'>Edit Couriers</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <Form
                        name='basic'
                        layout='vertical'
                        initialValues={{
                            courier_name: history.location.data && history.location.data.courier_name,
                            courier_code: history.location.data && history.location.data.courier_code,
                        }}
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
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditCourier;
