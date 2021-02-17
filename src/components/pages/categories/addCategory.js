import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { addCategory } from "../../../utils/APIGeneric/DataRequests";


const AddCategory = () => {
    const history = useHistory();

    useEffect(async () => {
        //console.log(history.location.data); working
    }, []);

    const onFinish = async (values) => {
        const res = await addCategory({ "name": values.categoryName });
        if (res.fail) {
            console.log('Cant add new Category -> ', res);
        }
        else {
            console.log('res -> ', res);
            history.push({
                pathname: '/categories',
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='page categoryAdd'>
            <div className='page__header'>
                <h1 className='page__title'>New Categories</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <Form
                        name='basic'
                        layout='vertical'
                        initialValues={{
                            remember: true
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <div className='form__row'>
                            <div className='form__col'>
                                <Form.Item
                                    label='Category Name'
                                    name='categoryName'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your category name'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>

                            <div className='form__col form__col--button'>
                                <Form.Item className='u-width-100'>
                                    <Button type='primary' htmlType='submit'>
                                        Add
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

export default AddCategory;
