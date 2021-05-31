import React, { useEffect, useState } from 'react';
import "../style.scss";
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import {
    ArrowLeftOutlined,
} from "@ant-design/icons";


const { Text } = Typography;



const ReceiptDelete = (props) => {
    const history = useHistory();
    const [templateData, setTemplateData] = useState({});
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { template_id = {} } = match !== undefined && match.params;



    useEffect(async () => {
        if (template_id !== undefined) {
            getTemplateData(template_id);
        }
        else {
            message.error("Template Id cannot be null", 2);
            setTimeout(() => {
                history.push({
                    pathname: '/setup/receipts-templates',
                    activeKey: 'receipts-templates',
                });
            }, 1000);
        }

    }, []);


    const getTemplateData = async (templateId) => {
        const getTepmlateResponse = await SetupApiUtil.getTemplate(templateId);
        console.log('getTepmlateResponse:', getTepmlateResponse);

        if (getTepmlateResponse.hasError) {
            console.log('Cant get template Data -> ', getTepmlateResponse.errorMessage);
            setLoading(false);
        }
        else {
            console.log('res -> ', getTepmlateResponse);
            var receivedTemplateData = getTepmlateResponse.template;
            message.success(getTepmlateResponse.message, 3);
            setTemplateData(receivedTemplateData);
            setLoading(false);

        }
    }



    const handleConfirm = async () => {
        if (buttonDisabled === false) {
            setButtonDisabled(true);}
        const hide = message.loading('Saving Changes in progress..', 0);
        const receiptDeleteResponse = await SetupApiUtil.deleteTemplate(templateData.template_id);
        console.log('receiptDeleteResponse:', receiptDeleteResponse);

        if (receiptDeleteResponse.hasError) {
            console.log('Cant delete Receipt -> ', receiptDeleteResponse.errorMessage);
            message.error(receiptDeleteResponse.errorMessage, 3);
            setButtonDisabled(false);
            setTimeout(hide, 1500);
        }
        else {
            console.log('res -> ', receiptDeleteResponse);
            message.success('Receipt deletion Succesfull ', 3);
            setTimeout(hide, 1500);
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
            <div style={{ textAlign: "center" }}>
                {loading && <Spin size="large" tip="Loading..." />}
            </div>
            <div className='page__header'>
                <h1 className='page__title'>
                    <Button type="primary" shape="circle" className="back-btn"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleCancel} />
                        Delete Template
                </h1>
            </div>


            {!loading &&
            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>
                                Do you really want to delete '{templateData !== undefined && templateData.template_name}'?</Text>
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

export default ReceiptDelete;
