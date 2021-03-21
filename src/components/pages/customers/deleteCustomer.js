import React, { useEffect, useState } from 'react';
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import {
    getSingleCustomer,
    deleteCustomer,
  } from '../../../utils/api/customer-api-utils';

const { Text } = Typography;

const DeleteCustomer = (props) => {
    const history = useHistory();
    const { match = {} } = props;
    const { customer_id = {} } = match.params;
    var customerId = customer_id;

    const [customerData, setCustomerData] = useState({});
    const [loading, setLoading] = useState(true);



    useEffect(async () => {
        fetchSingleCustomerData(customerId);

    }, []);



    const handleDeleteCustomer = async () => {
        const hide = message.loading('Saving Changes in progress..', 0);
        const customerDeleteResponse = await deleteCustomer(customerId);
        console.log('customerDeleteResponse:', customerDeleteResponse);

        if (customerDeleteResponse.hasError) {
            console.log('Cant delete Customer -> ', customerDeleteResponse.errorMessage);
            message.error( customerDeleteResponse.errorMessage, 3);
            setTimeout(hide, 1000);
        }
        else {
            setTimeout(hide, 1000);
            console.log('res -> ', customerDeleteResponse);
            message.success(customerDeleteResponse.message, 3);
            setTimeout(() => {
                history.push({
                    pathname: '/customers',
                });
            }, 1500);
        }
    };


    const fetchSingleCustomerData = async (customerId) => {
       
        const singleCustomerDataResponse = await getSingleCustomer(customerId);
    
        if (singleCustomerDataResponse.hasError) {
            setLoading(false);
          return  history.goBack();
        }

        const customerData = singleCustomerDataResponse.customer;
        const mappedCustomerResponse = {
            balance: customerData.balance,
            code: customerData.customer_code,
            email: customerData.customer_email,
            name: customerData.customer_name,
            phone: customerData.customer_phone,
            gender: customerData.customer_sex,
            id: customerData.id
          };
    
        setCustomerData(mappedCustomerResponse);
        setLoading(false);

      };



    const handleCancel = () => {
         history.goBack();
    };



    return (
        <div className='page categoryDel'>
            <div style={{ textAlign: "center" }}>
                {loading && <Spin size="large" tip="Loading..." />}
            </div>
            <div className='page__header'>
                <h1 className='page__title'>Delete customer</h1>
            </div>


            {!loading &&
            <div className='page__content'>
                <div className='page__form'>
                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{customerData.name }'?</Text>
                        </div>
                    </div>
                    <br />
                    <div className='form__row--footer'>
                        <Button type='primary' danger
                            onClick={() => handleDeleteCustomer()}>
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

export default DeleteCustomer;
