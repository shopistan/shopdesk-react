import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CategoriesApiUtil from '../../../utils/api/categories-api-utils';

const EditCategory = () => {
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect(async () => {
        //console.log(history.location.data); working
    }, []);

    const onFinish = async (values) => {
        const categoryEditResponse = await CategoriesApiUtil.editCategory(history.location.data.category_id,  values.categoryName);
        console.log('categoryEditResponse:', categoryEditResponse);
        if (categoryEditResponse.hasError) {
            console.log('Cant Edit a Category -> ', categoryEditResponse.errorMessage);
            message.error('Category Cant Edit ', 3);
        }
        else {
            console.log('res -> ', categoryEditResponse);
            message.success('Category Editing Succesfull ', 3);
            setTimeout(() => {
                history.push({
                  pathname: '/categories',
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
                <h1 className='page__title'>Edit Categories</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <Form
                        name='basic'
                        layout='vertical'
                        initialValues={{
                            categoryName: history.location.data.category_name,
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
                                        Done
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

export default EditCategory;
