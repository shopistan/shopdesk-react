import React, { useState, useEffect } from 'react';
import { Button, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CategoriesApiUtil from '../../../utils/api/categories-api-utils';

const { Text } = Typography;

const DeleteCategory = () => {
    const history = useHistory();

    useEffect(async () => {
        //console.log(history.location.data); working
    }, []);

    const handleConfirm = async () => {
        const categoryDeleteResponse = await CategoriesApiUtil.deleteCategory(history.location.data.category_id);
        console.log('categoryDeleteResponse:', categoryDeleteResponse);

        if (categoryDeleteResponse.hasError) {
            console.log('Cant delete a Category -> ', categoryDeleteResponse.errorMessage);
        }
        else {
            console.log('res -> ', categoryDeleteResponse);
            history.push({
                pathname: '/categories',
            });
        }
    };

    const handleCancel = () => {
        history.push({
            pathname: '/categories',
        });
    };


    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'>Delete Categories</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{history.location.data.category_name}'?</Text>
                        </div>

                    </div>
                    <br />
                    <div className='form__row'>
                        <div className='form__col'>
                            <Button type='primary' danger
                                onClick={() => handleConfirm()}>
                                Confirm
                                </Button>
                        </div>
                        <div className='form__col'>
                            <Button
                                onClick={() => handleCancel()}>
                                Cancel
                                </Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategory;
