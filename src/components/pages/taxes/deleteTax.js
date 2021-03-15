import React, { useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import { useHistory } from 'react-router-dom';
import * as TaxApiUtil from '../../../utils/api/tax-api-utils';

const { Text } = Typography;

const DeleteTax = () => {
    const history = useHistory();

    useEffect(async () => {
        if (history.location.data === undefined) {
            history.push({
                pathname: '/taxes',
            });
        }

    }, []);

    const handleConfirm = async () => {
        const taxDeleteResponse = await TaxApiUtil.deleteTax(history.location.data.tax_id);
        console.log('taxDeleteResponse:', taxDeleteResponse);

        if (taxDeleteResponse.hasError) {
            console.log('Cant delete Tax -> ', taxDeleteResponse.errorMessage);
            message.error('Tax deletion UnSuccesfull ', 3);
        }
        else {
            console.log('res -> ', taxDeleteResponse);
            message.success(taxDeleteResponse.message, 3);
            setTimeout(() => {
                history.push({
                    pathname: '/taxes',
                });
            }, 2000);
        }
    };

    const handleCancel = () => {
        history.push({
            pathname: '/taxes',
        });
    };



    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'>Delete Tax</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>
                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{history.location.data && history.location.data.tax_name }'?</Text>
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

export default DeleteTax;
