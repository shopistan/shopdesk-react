import React, {  useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';

const { Text } = Typography;

const DeleteCourier  = () => {
    const history = useHistory();

    useEffect(async () => {
        //console.log(history.location.data); working
        if (history.location.data === undefined) {
            history.push({
                pathname: '/couriers',
            });
        }
        
    }, []);

    const handleConfirm = async () => {
        const courierDeleteResponse = await  CouriersApiUtil.deleteCourier(history.location.data.courier_id);
        console.log('courierDeleteResponse:', courierDeleteResponse);

        if (courierDeleteResponse.hasError) {
            console.log('Cant delete courier -> ', courierDeleteResponse.errorMessage);
            message.error('Courier deletion UnSuccesfull ', 3);
        }
        else {
            console.log('res -> ', courierDeleteResponse);
            message.success('Courier deletion Succesfull ', 3);
            setTimeout(() => {
                history.push({
                  pathname: '/couriers',
              });
            }, 2000);
        }
    };

    const handleCancel = () => {
        history.push({
            pathname: '/couriers',
        });
    };


    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'>Delete Couriers</h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{
                            history.location.data && history.location.data.courier_name}'?</Text>
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

export default DeleteCourier;
