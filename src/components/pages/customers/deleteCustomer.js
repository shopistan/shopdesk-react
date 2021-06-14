import React, { useEffect, useState } from 'react';
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import {
    getSingleCustomer,
    deleteCustomer,
  } from '../../../utils/api/customer-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";


const { Text } = Typography;

const DeleteCustomer = (props) => {
    const history = useHistory();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { customer_id = {} } = match.params;
    var customerId = customer_id;

    const [customerData, setCustomerData] = useState({});
    const [loading, setLoading] = useState(true);

    var mounted = true;



    useEffect(async () => {
        fetchSingleCustomerData(customerId);

        return () => {
            mounted = false;
          }

    }, []);



    const handleDeleteCustomer = async () => {
        if (buttonDisabled === false) {
            setButtonDisabled(true);}
        
        document.getElementById('app-loader-container').style.display = "block";
        const customerDeleteResponse = await deleteCustomer(customerId);
        console.log('customerDeleteResponse:', customerDeleteResponse);

        if (customerDeleteResponse.hasError) {
            console.log('Cant delete Customer -> ', customerDeleteResponse.errorMessage);
            setButtonDisabled(false);
            document.getElementById('app-loader-container').style.display = "none";
            message.error( customerDeleteResponse.errorMessage, 2);
        }
        else {
            console.log('res -> ', customerDeleteResponse);
            if (mounted) {     //imp if unmounted
                document.getElementById('app-loader-container').style.display = "none";
                //message.success(customerDeleteResponse.message, 1);
                setTimeout(() => {
                    history.push({
                        pathname: '/customers',
                    });
                }, 1200);
            }
        }
    };


    const fetchSingleCustomerData = async (customerId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const singleCustomerDataResponse = await getSingleCustomer(customerId);
    
        if (singleCustomerDataResponse.hasError) {
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
            return history.goBack();
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
        document.getElementById('app-loader-container').style.display = "none";

      };



    const handleCancel = () => {
         history.goBack();
    };



    return (
        <div className='page categoryDel'>

            <div className='page__header'>
                <h1 className='page__title'><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Delete customer</h1>
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
                            disabled={buttonDisabled}
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
