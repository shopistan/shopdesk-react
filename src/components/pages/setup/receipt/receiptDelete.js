import React, { useEffect } from 'react';
import "../style.scss";
import { Button, Typography, message } from 'antd';
import { useHistory } from 'react-router-dom';
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import {
    ArrowLeftOutlined,
  } from "@ant-design/icons";


const { Text } = Typography;




const ReceiptDelete = () => {
    const history = useHistory();

    useEffect(async () => {
        if (history.location.data === undefined) {
            history.push({
                pathname: '/setup/receipts-templates',
                activeKey: 'receipts-templates',
            });
        }

    }, []);


    const handleConfirm = async () => {
        const receiptDeleteResponse = await SetupApiUtil.deleteTemplate(history.location.data.template_id);
        console.log('receiptDeleteResponse:', receiptDeleteResponse);

        if (receiptDeleteResponse.hasError) {
            console.log('Cant delete Receipt -> ', receiptDeleteResponse.errorMessage);
            message.error(receiptDeleteResponse.errorMessage, 3);
        }
        else {
            console.log('res -> ', receiptDeleteResponse);
            message.success('Receipt deletion Succesfull ', 3);
            setTimeout(() => {
                history.push({
                    pathname: '/setup/receipts-templates',
                    activeKey: 'receipts-templates',
                });
            }, 2000);
        }
    };


    const handleCancel = () => {
        history.push({
            pathname: '/setup/receipts-templates',
            activeKey: 'receipts-templates',
        });
    };


    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'>
                    <Button type="primary" shape="circle" className="back-btn"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleCancel} />
                        Delete Template
                </h1>
            </div>

            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>
                                Do you really want to delete '{history.location.data && history.location.data.template_name}'?</Text>
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

export default ReceiptDelete;
