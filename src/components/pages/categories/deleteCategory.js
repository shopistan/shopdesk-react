import React, {  useEffect } from 'react';
import { Button, Typography, message } from 'antd';
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
            message.error('Category deletion UnSuccesfull ', 3);
        }
        else {
            console.log('res -> ', categoryDeleteResponse);
            message.success('Category deletion Succesfull ', 3);
            setTimeout(() => {
                history.push({
                  pathname: '/categories',
              });
            }, 2000);
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
                    <div className='form__row--footer'>
                        <Button type='primary' danger
                            onClick={() => handleConfirm()}>
                            Confirm
                        </Button>

                        <Button
                            onClick={() => handleCancel()}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategory;
