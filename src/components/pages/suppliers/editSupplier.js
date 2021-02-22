import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as SuppliersApiUtil from '../../../utils/api/suppliers-api-utils';
import { useHistory } from "react-router-dom";

const EditSupplier = () => {
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect(async () => {
        //console.log(history.location.data); working
    }, []);

    const onFinish = async (values) => {
        const supplierEditResponse = await SuppliersApiUtil.editSupplier(history.location.data.supplier_id,
            values.supplier_name, values.contact_person, values.phone, values.email, values.tax);

        console.log('supplierEditResponse:', supplierEditResponse);
        if (supplierEditResponse.hasError) {
            console.log('Cant Edit Supplier -> ', supplierEditResponse.errorMessage);
            message.error('Cant Edit Supplier', 3);
        }
        else {
            console.log('res -> ', supplierEditResponse);
            message.success('Supplier Editing Succesfull ', 3);
            setTimeout(() => {
                history.push({
                    pathname: '/suppliers',
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
                <h1 className='page__title'>Edit Supplier</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <Form
                        name='basic'
                        layout='vertical'
                        initialValues={{
                            supplier_name: history.location.data.supplier_name,
                            contact_person: history.location.data.supplier_contact_name,
                            email: history.location.data.supplier_contact_email,
                            phone: history.location.data.supplier_contact_phone,
                            tax: history.location.data.supplier_tax_number,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <div className='form__row'>
                            <div className='form__col'>
                                <Form.Item
                                    label='Supplier Name'
                                    name='supplier_name'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input supplier name!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='form__col'>
                                <Form.Item
                                    label='Contact Person Name'
                                    name='contact_person'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input contact person name!",
                                        },
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
                                            type: "email",
                                            message: "Please input valid email!",
                                        },
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
                                            message: "Please input valid phone!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='form__row'>
                            <div className='form__col'>
                                <Form.Item
                                    label='Tax ID'
                                    name='tax'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input valid tax ID",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>

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

export default EditSupplier;
