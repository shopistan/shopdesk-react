import React, {  useEffect, useState } from 'react';
import { Button, Typography, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import * as CategoriesApiUtil from '../../../utils/api/categories-api-utils';
import { ArrowLeftOutlined } from "@ant-design/icons";


const { Text } = Typography;

const DeleteCategory = (props) => {
    const history = useHistory();
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { match = {} } = props;
    const { cat_id = {} } = match !== undefined && match.params;

    var mounted = true;


    useEffect(() => {
        if (cat_id !== undefined) { getCategory(cat_id); }
        else {
            message.error("Category Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

        return () => {
            mounted = false;
        }

    }, []);

    
    const getCategory = async (categoryId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getCategoryResponse = await CategoriesApiUtil.getCategory(categoryId);
        console.log('getCategoryResponse:', getCategoryResponse);
        if (getCategoryResponse.hasError) {
            console.log('getCategory Cant Fetched -> ', getCategoryResponse.errorMessage);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', getCategoryResponse);
            if (mounted) {     //imp if unmounted
                //message.success(getCategoryResponse.message, 2);
                const categoryName = getCategoryResponse.category_name[0].category_name;  //vvimp
                setSelectedCategoryName(categoryName);
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
                message.success(getCategoryResponse.message, 2);
            }

        }
    }
    

    const handleConfirm = async () => {
        if (buttonDisabled === false) {
            setButtonDisabled(true);}

        document.getElementById('app-loader-container').style.display = "block";
        //const hide = message.loading('Saving Changes in progress..', 0);
        const categoryDeleteResponse = await CategoriesApiUtil.deleteCategory(cat_id);
        console.log('categoryDeleteResponse:', categoryDeleteResponse);

        if (categoryDeleteResponse.hasError) {
            console.log('Cant delete a Category -> ', categoryDeleteResponse.errorMessage);
            message.error(categoryDeleteResponse.errorMessage, 3);
            setButtonDisabled(false);
            //setTimeout(hide, 1500);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', categoryDeleteResponse);
            if (mounted) {     //imp if unmounted
                //setTimeout(hide, 1500);
                document.getElementById('app-loader-container').style.display = "none";
                message.success(categoryDeleteResponse.message, 3);
                setTimeout(() => {
                    history.push({
                        pathname: '/categories',
                    });
                }, 2000);
            }
        }
    };



    const handleCancel = () => {
        history.push({
            pathname: '/categories',
        });
    };


    return (
        <div className='page categoryDel'>
            <div className='page__header'>
                <h1 className='page__title'><Button type="primary" shape="circle" className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel} />Delete Categories</h1>
            </div>

            {!loading &&
            <div className='page__content'>
                <div className='page__form'>

                    <div className='form__row'>
                        <div className='form__col'>
                            <Text>Do you really want to delete '{
                                selectedCategoryName && selectedCategoryName}'?</Text>
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

export default DeleteCategory;
