import React, { useEffect, useState, useRef } from "react";
import "../../style.scss";
import { Form, Input, Button, Select, Badge, message, Spin, Modal, Divider } from "antd";
import { AppstoreAddOutlined, PlusCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import WebHooksTable from "../../../../organism/table/setup/outlets/webHooksNestedTable";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import currencyData from "../currencyData.json";
import * as Helpers from "../../../../../utils/helpers/scripts";
import Constants from '../../../../../utils/constants/constants';
import UrlConstants from '../../../../../utils/constants/url-configs';
import * as ApiCallUtil from '../../../../../utils/api/generic-api-utils';
import {
  getDataFromLocalStorage,
} from "../../../../../utils/local-storage/local-store-utils";
import axios from 'axios';




function OutletEdit(props) {
  const { Option, OptGroup } = Select;
  const { Search } = Input;
  const [show, setShow] = React.useState(true);

  const history = useHistory();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [templatesData, setTemplatesData] = useState([]);
  const [webHooksData, setWebHooksData] = useState([]);
  const [selectedStoreObj, setSelectedStoreObj] = useState({});  //imp one
  const [currenciesData, setCurrenciesData] = useState([]);
  const [selectedCurrencyObj, setSelectedCurrencyObj] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [webHookDeleteId, setWebHookDeleteId] = useState("");
  const [userLocalStorageData, setUserLocalStorageData] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [webHookUrlName, setWebHookUrlName] = useState("");
  const [generatedSecretKey, setGeneratedSecretKey] = useState('●●●●●●●●●●');
  const [foundStoreObjRandomKey, setFoundStoreObjRandomKey] = useState(null);
  const [outletOmniSettingsData, setOutletOmniSettingsData] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { outlet_id = {} } = match !== undefined && match.params;




  useEffect(() => {

    if (outlet_id !== undefined) {
      var currenciesDataArr = [...currencyData];
      //console.log(currenciesDataArr);
      setCurrenciesData(currenciesDataArr);
      fetchOutletWebHooks();
      getUserStoreData(outlet_id);
      fetchUsersTemplatesData();
      /*--------------set user local data-------------------------------*/
      let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
      readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
      setUserLocalStorageData(readFromLocalStorage);
      /*--------------set user local data-------------------------------*/
    }
    else {
      message.error("Oulet Id cannot be null", 2);
      setTimeout(() => {
        history.push({
          pathname: '/setup/outlets',
          activeKey: 'outlets'
        });
      }, 1000);
    }

  }, []);


  const fetchOutletWebHooks = async (pageLimit = 10, pageNumber = 1) => {
    const getWebHooksViewResponse = await SetupApiUtil.getWebHooks(pageLimit, pageNumber);
    console.log('getWebHooksViewResponse:', getWebHooksViewResponse);

    if (getWebHooksViewResponse.hasError) {
      console.log('Cant fetch Web Hooks Data -> ', getWebHooksViewResponse.errorMessage);
    }
    else {
      console.log('res -> ', getWebHooksViewResponse);
      //message.success(getWebHooksViewResponse.message, 3);
      setWebHooksData(getWebHooksViewResponse.webhooks);
    }
  }


  const getUserStoreData = async (storeId) => {
    const getOutletViewResponse = await SetupApiUtil.getOutlet(storeId);
    console.log('getOutletViewResponse:', getOutletViewResponse);

    if (getOutletViewResponse.hasError) {
      console.log('Cant fetch Store Data -> ', getOutletViewResponse.errorMessage);
    }
    else {
      console.log('res -> ', getOutletViewResponse);
      var selectedStore = getOutletViewResponse.outlet;
      //message.success(getOutletViewResponse.message, 3);
      setSelectedStoreObj(getOutletViewResponse.outlet);
      setSelectedCurrencyObj({
        code: selectedStore.currency_code,
        name: selectedStore.currency_name, symbol: selectedStore.currency_symbol
      });

      setFoundStoreObjRandomKey(selectedStore.store_random);
      let omniSettingsData = {};
      omniSettingsData.location= selectedStore.store_location_id || ''; 
      omniSettingsData.brand = selectedStore.store_brand_id || ''; 
      setOutletOmniSettingsData(omniSettingsData);

      /*-----setting template data to fields value------*/
      form.setFieldsValue({
        outlet: selectedStore.store_name,
        currency: selectedStore.currency_code,
        address: selectedStore.store_location,
        template: selectedStore.template_id,
        location: selectedStore.store_location_id || '',
        brand: selectedStore.store_brand_id || '',
      });
      /*-----setting template data to fields value------*/

    }
  }


  const fetchUsersTemplatesData = async () => {
    document.getElementById('app-loader-container').style.display = "block";
    const userTemplatesViewResponse = await SetupApiUtil.viewAllTemplates();
    console.log('userTemplatesViewResponse:', userTemplatesViewResponse);

    if (userTemplatesViewResponse.hasError) {
      console.log('Cant fetch Users templates Data -> ', userTemplatesViewResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', userTemplatesViewResponse);
      //message.success(userTemplatesViewResponse.message, 3);
      setTemplatesData(userTemplatesViewResponse.templates.data || userTemplatesViewResponse.templates);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
  }


  const requestUserLoginForNewApiKey = async () => {
    let refreshToken = userLocalStorageData.refresh_token;
    let never_expire = true;
    const loginResponse = await  SetupApiUtil.userLoginForNewApiKey(refreshToken, never_expire);
    if (loginResponse.hasError) {
      const errorMessage = loginResponse.errorMessage;
      console.log('Cant login -> ', errorMessage);
      message.error(errorMessage, 3);
    } else {
      const loggedInUserDetails = loginResponse;
      console.log("Success:", loggedInUserDetails);
      onSelectOutletForNewApiKey(loggedInUserDetails);

    }

  };



  const onSelectOutletForNewApiKey = async (loggedInUserDetails) => {
    let apiAuthToken = loggedInUserDetails.auth_token;

    if (foundStoreObjRandomKey) {
      const headers = {
        'Authorization': apiAuthToken,
      }
      const formDataPair = {
        store_random: foundStoreObjRandomKey,
        type:  Constants.X_API_KEY,
      };
      const selectOutletFormDataBody = ApiCallUtil.constructFormData(formDataPair);
      document.getElementById('app-loader-container').style.display = "block";
      await axios.post(UrlConstants.OULETS.SELECT_OUTLET, selectOutletFormDataBody, {
        headers: headers
      })
        .then((res) => {
          console.log('Select Outlet Response -> ', res);
          let userSelectOutletResponse = res.data;
          if (userSelectOutletResponse.hasError) {
            console.log('Cant Select Outlet -> ', userSelectOutletResponse.errorMessage);
            message.error(userSelectOutletResponse.errorMessage, 3);
            document.getElementById('app-loader-container').style.display = "none";
          }
          else {
            console.log('res -> ', userSelectOutletResponse);
            setGeneratedSecretKey(userSelectOutletResponse.api_key);
            message.success("Secret Key Successfully Generated", 3);
            document.getElementById('app-loader-container').style.display = "none";

          }

        })
        .catch((error) => {
          console.log("AXIOS ERROR: ", error);
          message.error(error, 3);
        })

      /*
      const hide = message.loading('Generating Key in progress..', 0);
      const userSelectOutletResponse = await SetupApiUtil.selectOutletForNewApiKey(foundStoreObj.store_random);
      console.log('userSelectOutletResponse:', userSelectOutletResponse)
      if (userSelectOutletResponse.hasError) {
        console.log('Cant Select Outlet -> ', userSelectOutletResponse.errorMessage);
        setTimeout(hide, 1500);
      }
      else {
        console.log('res -> ', userSelectOutletResponse);
        setTimeout(hide, 1500);
        setGeneratedSecretKey(userSelectOutletResponse.api_key);
        message.success("Secret Key Successfully Generated");

      } */

    }

    else { console.log("store not found"); }

  }


  const copySecretApiKey = () => {
    navigator.clipboard.writeText(generatedSecretKey)

  }


  const postAddWebHookData = async (webHookUrlName) => {
    
    document.getElementById('app-loader-container').style.display = "block";
    const addWebHookResponse = await SetupApiUtil.addWebHook(webHookUrlName);
    console.log('addWebHookResponse:', addWebHookResponse);
    setLoading(true);

    if (addWebHookResponse.hasError) {
      console.log('Cant add webhook -> ', addWebHookResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', addWebHookResponse);
      message.success(addWebHookResponse.message, 3);
      fetchOutletWebHooks();
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
  }

  const postDeleteWebHookData = async (webHookId) => {

    document.getElementById('app-loader-container').style.display = "block";
    const deleteWebHookResponse = await SetupApiUtil.deleteWebHook(webHookId);
    console.log('deleteWebHookResponse:', deleteWebHookResponse);
    setLoading(true);

    if (deleteWebHookResponse.hasError) {
      console.log('Cant add webhook -> ', deleteWebHookResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', deleteWebHookResponse);
      message.success(deleteWebHookResponse.message, 3);
      document.getElementById('app-loader-container').style.display = "none";
      fetchOutletWebHooks();
      setLoading(false);
    }
  }


  const handleCurrencyChange = (value) => {
    var selectedCurrencyCode = value;
    const index = currenciesData.findIndex(item => selectedCurrencyCode === item.code);
    if (index > -1) {
      setSelectedCurrencyObj(currenciesData[index]);
      console.log(currenciesData[index]);
    }
    else { setSelectedCurrencyObj(""); }

  }


  const onFinish = async (values) => {
    postEditOutletData();
  };


  const handleOmniForm = async () => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);

    let editOeKeyPostData = {};
    editOeKeyPostData.brand = formValues.brand; 
    editOeKeyPostData.location = formValues.location;

    
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    
    document.getElementById('app-loader-container').style.display = "block";
    const addOeKeyDataResponse = await SetupApiUtil.addOeKey(editOeKeyPostData);
    console.log('editOeKeyDataResponse:', addOeKeyDataResponse);

    if (addOeKeyDataResponse.hasError) {
      console.log('Cant Add Oe Keys Data -> ', addOeKeyDataResponse.errorMessage);
      message.error(addOeKeyDataResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setButtonDisabled(false);
    }
    else {
      console.log('res -> ', addOeKeyDataResponse);
      message.success(addOeKeyDataResponse.message, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(() => {
        history.push({
          pathname: '/outlets',
        });
      }, 2000);
    }

  };



  const postEditOutletData = async () => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);


    var editOutletPostData = {};
    editOutletPostData.store_name = formValues.outlet;
    if (outletOmniSettingsData) { editOutletPostData.store_brand_id = outletOmniSettingsData.brand; }
    if (outletOmniSettingsData) { editOutletPostData.store_location_id = outletOmniSettingsData.location; }
    editOutletPostData.currency = selectedCurrencyObj;
    editOutletPostData.template_id = formValues.template;
    editOutletPostData.store_random = selectedStoreObj.store_random;
    editOutletPostData.store_location = formValues.address;
    editOutletPostData.store_id = selectedStoreObj.store_id;


    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    const editOutletResponse = await SetupApiUtil.editOutlet(editOutletPostData);
    console.log('editOutletResponse:', editOutletResponse);

    if (editOutletResponse.hasError) {
      console.log('Cant Edit Template -> ', editOutletResponse.errorMessage);
      message.error(editOutletResponse.errorMessage, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setButtonDisabled(false);
    }
    else {
      console.log('res -> ', editOutletResponse);
      message.success(editOutletResponse.message, 3);
      document.getElementById('app-loader-container').style.display = "none";
      setTimeout(() => {
        history.push({
          pathname: '/setup/outlets',
          activeKey: 'outlets'
        });
      }, 2000);
    }

  };


  const onHandleWebHookDelete = (tableRecord) => {
    console.log(tableRecord);
    setWebHookDeleteId(tableRecord.id);    //webhook row id
    setIsDeleteModalVisible(true);
  };


  const confirmDeleteWebHook = (e) => {
    postDeleteWebHookData(webHookDeleteId);  //webhook row id
    setIsDeleteModalVisible(false);
  };


  const addWebHook = (e) => {
    setIsModalVisible(true);
  };


  const confirmAddWebHook = (e) => {
    let check = urlCheck(webHookUrlName);
    console.log(webHookUrlName);
    if (check) {
      postAddWebHookData(webHookUrlName);
      setIsModalVisible(false);
    }
    else {
      setIsModalVisible(false);
      message.error("WebHook URL is invalid", 3)
    }
  };


  const handleChangeWebHookUrl = (e) => {
    console.log(e.target.value);
    setWebHookUrlName("http://" + e.target.value);
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    history.push({
      pathname: '/setup/outlets',
      activeKey: 'outlets'
    });
  };



  function urlCheck(t) {
    var regex = new RegExp(
      "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );

    if (t.match(regex)) {
      return true;
    } else {
      return false;
    }
  }

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };


  const handleCancelDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };


  const copySecrectButton = (
    <Button type='primary'
      className='custom-btn custom-btn--primary'
      onClick={copySecretApiKey}>
      Copy
    </Button>
  )




  return (
    <div className='page dashboard'>
      
      <div className='page__header'>
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Edit Outlet</h1>
      </div>


      <div className='page__content'>
        <div className='page__form'>
          <Form
            form={form}
            name='basic'
            layout='vertical'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* Form Section */}
            <div className='form__section'>
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Outlet Name"
                    name="outlet"
                    rules={[
                      {
                        required: true,
                        message: "Please input outlet name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item
                    label="Currency"
                    name="currency"
                    rules={[
                      {
                        required: true,
                        message: "Please select currency!",
                      },
                    ]}
                  >
                    <Select onChange={handleCurrencyChange}
                      placeholder="Select Currency"
                      showSearch    //vimpp to seach
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        //console.log(option);
                        return (
                          option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0)
                      }}
                      filterSort={(optionA, optionB) =>
                        optionA.children[1].toLowerCase().localeCompare(optionB.children[1].toLowerCase())
                      }

                    >
                      {
                        currenciesData.map((obj, index) => {
                          return (
                            <Option key={obj.code} value={obj.code}>
                              <img className="currency-flag-img"
                                src={`/images/flags/${((obj.code).substring(0, 2)).toLowerCase()}.png`} />
                              {obj.name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                </div>
              </div>


              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Receipt Template"
                    name="template"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Template!",
                      },
                    ]}
                  >

                    <Select
                      placeholder="Select Template"
                      showSearch    //vimpp to seach
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        //console.log(option);
                        return (
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                      }}
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }

                    >
                      {
                        templatesData.map((obj, index) => {
                          return (
                            <Option  key={obj.template_id} value={obj.template_id}>
                              {obj.template_name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item
                    label="Business Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Please input address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className='form__row--footer'>
                <Button type='secondary' onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  type='primary'
                  htmlType='submit'
                  className='custom-btn custom-btn--primary'
                  disabled={buttonDisabled}
                >
                  Save
                </Button>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header'>
                <h2>Outlet API KEY</h2>
                <p>
                  Token Type: <Badge count={"Bearer"} />
                </p>
              </div>

              <div className='form__row'>
                <div className='form__col form__col--btn'>
                  <Input
                    //name= "secret_api_key"
                    addonAfter={copySecrectButton}
                    value={generatedSecretKey}
                    disabled
                    //type="password"
                  />

                  <Button
                    type='primary'
                    icon={<AppstoreAddOutlined />}
                    className='custom-btn custom-btn--primary'
                    onClick={requestUserLoginForNewApiKey}

                  >
                    Generate Secret
                  </Button>
                </div>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header form__section__header--btn'>
                <h2>HTTP WebHooks</h2>

                <Button
                  type='primary'
                  icon={<PlusCircleOutlined />}
                  onClick={addWebHook}
                  className='custom-btn custom-btn--primary'
                >
                  Add New
                </Button>
              </div>
            </div>
            {/* Form Section */}

            {/* table Section */}
            <div className='form__row'>
              {/* Table */}
              <div className='table' style={{width: "100%"}}>
                <WebHooksTable pageLimit={paginationLimit} tableData={webHooksData}
                  tableDataLoading={loading}
                  onClickDeleteWebHook={onHandleWebHookDelete} />
              </div>
              {/* Table */}
            </div>
            {/* table Section */}
            <Divider />

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header form__section__header--btn'>
                <h2>Shopistan OmniEngine Settings</h2>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Location ID'
                  name='location'
                  rules={[
                    {
                      required: true,
                      message: "Please input Location!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className='form__col'>
                <Form.Item
                  label='Brand ID'
                  name='brand'
                  rules={[
                    {
                      required: true,
                      message: "Please input Brand!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className='form__row--footer'>
              <Button type='secondary' onClick={handleCancel}>
                Cancel
              </Button>

              <Button
                type='primary'
                onClick={handleOmniForm}
                className='custom-btn custom-btn--primary'
                disabled={buttonDisabled}
              >
                Save
              </Button>
            </div>
            {/* Form Section */}
          </Form>
        </div>
        {/*end page content*/}

        <Modal title="Add WebHook" visible={isModalVisible} onOk={confirmAddWebHook}
          onCancel={handleCancelModal}>
          <label> Enter a url for webhook</label>
          <div className='form__row'>
            <div className='form__col'>
              <Input addonBefore="http://" onChange={handleChangeWebHookUrl} />
            </div>
          </div>
        </Modal>


        <Modal title="Basic Modal" visible={isDeleteModalVisible} onOk={confirmDeleteWebHook}
          onCancel={handleCancelDeleteModal}>
          <label> Do you really want to delete this webhook?</label>
        </Modal>

      </div>


    </div>
  );
}

export default OutletEdit;
