import React, { useEffect, useState } from 'react';
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as TaxApiUtil from '../../../utils/api/tax-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";


const { Text } = Typography;

const DeleteTax = (props) => {
    const history = useHistory();
    const [selectedTaxData, setSelectedTaxData] = useState({});
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { tax_id = {} } = match !== undefined && match.params;

    var mounted = true;



    useEffect(async () => {
        if (tax_id !== undefined) { getTax(tax_id); }
        else {
            message.error("Tax Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 2000);
        }

        return () => {
            mounted = false;
        }

    }, []);


    const getTax = async (taxId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const gettaxResponse = await TaxApiUtil.getTax(taxId);
        console.log('gettaxResponse:', gettaxResponse);
        if (gettaxResponse.hasError) {
            console.log('getTax Cant Fetched -> ', gettaxResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
            message.error(gettaxResponse.errorMessage, 2);
        }
        else {
            console.log('res -> ', gettaxResponse.message);
            if (mounted) {     //imp if unmounted
                const taxData = gettaxResponse.tax[0];  //vvimp
                setSelectedTaxData(taxData);
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
                message.success(gettaxResponse.message, 2);
            }

        }
    }


    const handleConfirm = async () => {
        if (buttonDisabled === false) {
            setButtonDisabled(true);
        }

        document.getElementById('app-loader-container').style.display = "block";
        const taxDeleteResponse = await TaxApiUtil.deleteTax(selectedTaxData.tax_id);
        console.log('taxDeleteResponse:', taxDeleteResponse);

        if (taxDeleteResponse.hasError) {
            console.log('Cant delete Tax -> ', taxDeleteResponse.errorMessage);
            setButtonDisabled(false);
            document.getElementById('app-loader-container').style.display = "none";
            message.error(taxDeleteResponse.errorMessage, 3);
        }
        else {
            console.log('res -> ', taxDeleteResponse.message);
            if (mounted) {     //imp if unmounted
                document.getElementById('app-loader-container').style.display = "none";
                message.success(taxDeleteResponse.message, 1);
                setTimeout(() => {
                    history.push({
                        pathname: '/taxes',
                    });
                }, 1200);
            }
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
                <h1 className='page__title'><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Delete Tax</h1>
            </div>

            {!loading &&
                <div className='page__content'>
                    <div className='page__form'>
                        <div className='form__row'>
                            <div className='form__col'>
                                <Text>Do you really want to delete '{selectedTaxData !== undefined && selectedTaxData.tax_name}'?</Text>
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

export default DeleteTax;
