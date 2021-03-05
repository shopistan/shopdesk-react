import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as TaxApiUtil from '../../../utils/api/tax-api-utils';
import { useHistory } from "react-router-dom";

const EditTax = () => {
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect(() => {
        if (history.location.data === undefined) {
            history.push({
                pathname: '/taxes',
            });
        }

    }, []);



    const onFinish = async (values) => {
        const taxEditResponse = await TaxApiUtil.editTax(history.location.data.tax_id,
            values.tax_name, values.tax_value);

        console.log('taxEditResponse:', taxEditResponse);
        if (taxEditResponse.hasError) {
            console.log('Cant Edit Tax -> ', taxEditResponse.errorMessage);
            message.error('Cant Edit Tax', 3);
        }
        else {
            console.log('res -> ', taxEditResponse);
            message.success(taxEditResponse.message, 3);
            setTimeout(() => {
                history.push({
                    pathname: '/taxes',
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
                <h1 className='page__title'>Edit Tax</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <Form
                        name='basic'
                        layout='vertical'
                        initialValues={{
                            tax_name: history.location.data ? history.location.data.tax_name : '',
                            tax_value: history.location.data ? history.location.data.tax_value : '',

                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <div className='form__row'>
                            <div className='form__col'>
                                <Form.Item
                                    label='Tax Name'
                                    name='tax_name'
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

                            <div className='form__col'>
                                <Form.Item
                                    label='Tax Percentage'
                                    name='tax_value'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input tax percentage!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='form__row'>
                            <div className='form__col form__col--button'>
                                <Form.Item className='u-width-100'>
                                    <Button type='primary' htmlType='submit'>
                                        Edit
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>

                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditTax;
