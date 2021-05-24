import React, { useEffect, useState } from 'react';
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as SuppliersApiUtil from '../../../utils/api/suppliers-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";


const { Text } = Typography;

const DeleteSupplier = (props) => {
    const history = useHistory();
    const [SupplierData, setSupplierData] = useState({});
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { supplier_id = {} } = match !== undefined && match.params;

    var mounted = true;

    

    useEffect(() => {
        if (supplier_id !== undefined) { getSupplier(supplier_id); }
        else {
            message.error("Supplier Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

        return () => {
            mounted = false;
        }

    }, []);


    const getSupplier = async (supplierId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getSupplierResponse = await SuppliersApiUtil.getSupplier(supplierId);
        console.log('getSupplierResponse:', getSupplierResponse);
        if (getSupplierResponse.hasError) {
            console.log('Supplier Cant Fetched -> ', getSupplierResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log("res -> ", getSupplierResponse.message);
            if (mounted) {     //imp if unmounted
                message.success(getSupplierResponse.message, 2);
                const supplierData = getSupplierResponse.supplier[0];  //vvimp
                setSupplierData(supplierData);
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }
    }

    const handleConfirm = async () => {
        if (buttonDisabled === false) {
            setButtonDisabled(true);}

        document.getElementById('app-loader-container').style.display = "block";
        const hide = message.loading('Saving Changes in progress..', 0);
        const supplierDeleteResponse = await SuppliersApiUtil.deleteSupplier(SupplierData.supplier_id);
        console.log('supplierDeleteResponse:', supplierDeleteResponse);

        if (supplierDeleteResponse.hasError) {
            console.log('Cant delete a Category -> ', supplierDeleteResponse.errorMessage);
            message.error(supplierDeleteResponse.errorMessage, 3);
            document.getElementById('app-loader-container').style.display = "none";
            setButtonDisabled(false);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', supplierDeleteResponse.message);
            if (mounted) {     //imp if unmounted
                message.success(supplierDeleteResponse.message, 3);
                document.getElementById('app-loader-container').style.display = "none";
                setTimeout(hide, 1500);
                setTimeout(() => {
                    history.push({
                        pathname: '/suppliers',
                    });
                }, 2000);
            }
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
                <h1 className='page__title'><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Delete Supplier</h1>
            </div>

            {!loading &&
                <div className='page__content'>
                    <div className='page__form'>
                        <div className='form__row'>
                            <div className='form__col'>
                                <Text>Do you really want to delete '{
                                    SupplierData !== undefined && SupplierData.supplier_name}'?</Text>
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

export default DeleteSupplier;
