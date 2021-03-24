import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CategoriesApiUtil from '../../../utils/api/categories-api-utils';

const EditCategory = (props) => {
    const history = useHistory();
    const [categoryDataFields, setCategoryDataFields] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    //console.log("props", props)
    const { match = {} } = props;
    const { cat_id = {} } = match !== undefined && match.params;


    useEffect(() => {
        //console.log("history", history);  //working
        if (cat_id !== undefined) { getCategory(cat_id); }
        else {
            message.error("Category Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

    }, []);


    const getCategory = async (categoryId) => {
        const getCategoryResponse = await CategoriesApiUtil.getCategory(categoryId);
        console.log('getCategoryResponse:', getCategoryResponse);
        if (getCategoryResponse.hasError) {
            console.log('getCategory Cant Fetched -> ', getCategoryResponse.errorMessage);
            setLoading(false);
        }
        else {
            console.log('res -> ', getCategoryResponse);
            message.success(getCategoryResponse.message, 2);
            const categoryName = getCategoryResponse.category_name[0].category_name;  //vvimp
            setSelectedCategoryName(categoryName);
            const fieldsForAntForm = [
                {
                    name: ['categoryName'],
                    value: categoryName
                },
            ];
            setCategoryDataFields(fieldsForAntForm);
            setLoading(false);

        }
    }


    const onFinish = async (values) => {
        const hide = message.loading('Saving Changes in progress..', 0);
        const categoryEditResponse = await CategoriesApiUtil.editCategory(cat_id, values.categoryName);
        console.log('categoryEditResponse:', categoryEditResponse);
        if (categoryEditResponse.hasError) {
            console.log('Cant Edit a Category -> ', categoryEditResponse.errorMessage);
            message.error('Category Cant Edit ', 3);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', categoryEditResponse);
            message.success('Category Editing Succesfull ', 3);
            setTimeout(hide, 1500);
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
            <div style={{ textAlign: "center" }}>
                {loading && <Spin size="large" tip="Loading..." />}
            </div>

            {!loading &&
                <div className='page__content'>
                    <div className='page__form'>
                        <Form
                            name='basic'
                            layout='vertical'
                            fields={categoryDataFields}
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
                </div>}
        </div>
    );
};

export default EditCategory;
