import React, {  useEffect, useState } from 'react';
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CouriersApiUtil from '../../../utils/api/couriers-api-utils';

const { Text } = Typography;

const DeleteCourier  = (props) => {
    const history = useHistory();
    const [selectedCourierData, setSelectedCourierData] = useState({});
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { courier_id = {} } = match !== undefined && match.params;

    var mounted = true;


    useEffect(() => {
        if (courier_id !== undefined) { getCourier(courier_id); }
        else {
            message.error("Courier Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

        return () => {
            mounted = false;
        }
        
    }, []);


    const getCourier = async (courierId) => {
        const getCourierResponse = await CouriersApiUtil.getCourier(courierId);
        console.log('getCourierResponse:', getCourierResponse);
        if (getCourierResponse.hasError) {
            console.log('Courier Cant Fetched -> ', getCourierResponse.errorMessage);
            setLoading(false);
        }
        else {
            message.success(getCourierResponse.message, 2);
            if (mounted) {     //imp if unmounted
                const courierData = getCourierResponse.courier[0];  //vvimp
                setSelectedCourierData(courierData);
                setLoading(false);
            }
        }
    }



    const handleConfirm = async () => {
        if (buttonDisabled === false) {
            setButtonDisabled(true);}
        const hide = message.loading('Saving Changes in progress..', 0);
        const courierDeleteResponse = await  CouriersApiUtil.deleteCourier(courier_id);
        console.log('courierDeleteResponse:', courierDeleteResponse);

        if (courierDeleteResponse.hasError) {
            console.log('Cant delete courier -> ', courierDeleteResponse.errorMessage);
            message.error(courierDeleteResponse.errorMessage, 3);
            setButtonDisabled(false);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', courierDeleteResponse);
            if (mounted) {     //imp if unmounted
                message.success(courierDeleteResponse.message, 3);
                setTimeout(hide, 1500);
                setTimeout(() => {
                    history.push({
                        pathname: '/couriers',
                    });
                }, 2000);
            }
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
            <div style={{ textAlign: "center" }}>
                {loading && <Spin size="large" tip="Loading..." />}
            </div>


            {!loading &&
            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{
                            selectedCourierData !== undefined && selectedCourierData.courier_name}'?</Text>
                        </div>

                    </div>
                    <br />
                    <div className='form__row--footer'>
                        <Button type='primary' danger
                            disabled={buttonDisabled}
                            onClick={() => handleConfirm()}>
                            Confirm
                        </Button>

                        <Button
                            onClick={() => handleCancel()}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default DeleteCourier;
