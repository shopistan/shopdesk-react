import React, { useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import { useHistory } from 'react-router-dom';
import * as SuppliersApiUtil from '../../../utils/api/suppliers-api-utils';

const { Text } = Typography;

const DeleteSupplier = () => {
    const history = useHistory();

    useEffect(async () => {
        //console.log(history.location.data); working
    }, []);

    const handleConfirm = async () => {
        const supplierDeleteResponse = await SuppliersApiUtil.deleteSupplier(history.location.data.supplier_id);
        console.log('supplierDeleteResponse:', supplierDeleteResponse);

        if (supplierDeleteResponse.hasError) {
            console.log('Cant delete a Category -> ', supplierDeleteResponse.errorMessage);
            message.error('Supplier deletion UnSuccesfull ', 3);
        }
        else {
            console.log('res -> ', supplierDeleteResponse);
            message.success('Supplier deletion Succesfull ', 3);
            setTimeout(() => {
                history.push({
                    pathname: '/suppliers',
                });
            }, 2000);
        }
    };

    const handleCancel = () => {
        history.push({
            pathname: '/suppliers',
        });
    };


    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'>Delete Supplier</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{history.location.data.supplier_name}'?</Text>
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

export default DeleteSupplier;
