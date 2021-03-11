import React, { useEffect, useState } from "react";
import "../../style.scss";
import { Form, Input, Button, Select, Badge, message, Spin } from "antd";
import { AppstoreAddOutlined, PlusCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import WebHooksTable from "../../../../organism/table/setup/outlets/webHooksNestedTable";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import currencyData from "../currencyData.json";





function OutletEdit() {
  const { Option } = Select;
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




  useEffect(() => {
    console.log(history.location.data);

    if (history.location.data === undefined) {
      history.push({
        pathname: '/setup/outlets',
      });
    }
    else {
      var currenciesDataArr = [...currencyData];
      console.log(currenciesDataArr);
      setCurrenciesData(currenciesDataArr);

      fetchOutletWebHooks();
      getUserStoreData(history.location.data.store_id);
      fetchUsersTemplatesData();


    }

  }, []);


  const fetchOutletWebHooks = async (pageLimit = 20, pageNumber = 1) => {
    const getWebHooksViewResponse = await SetupApiUtil.getWebHooks(pageLimit, pageNumber);
    console.log('getWebHooksViewResponse:', getWebHooksViewResponse);

    if (getWebHooksViewResponse.hasError) {
      console.log('Cant fetch Web Hooks Data -> ', getWebHooksViewResponse.errorMessage);
    }
    else {
      console.log('res -> ', getWebHooksViewResponse);
      message.success(getWebHooksViewResponse.message, 3);
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
      message.success(getOutletViewResponse.message, 3);
      setSelectedStoreObj(getOutletViewResponse.outlet);
      setSelectedCurrencyObj({code: selectedStore.currency_code,
         name: selectedStore.currency_name, symbol: selectedStore.currency_symbol});
        /*-----setting template data to fields value------*/
        form.setFieldsValue({
          outlet: selectedStore.store_name,
          currency: selectedStore.currency_code,
          address: selectedStore.store_location,
          template: selectedStore.template_id,
          location: selectedStore.store_location_id,
          brand: selectedStore.store_brand_id,
         });
         /*-----setting template data to fields value------*/
      
    }
  }


  const fetchUsersTemplatesData = async (pageLimit = 50, pageNumber = 1) => {
    const userTemplatesViewResponse = await SetupApiUtil.viewTemplates(pageLimit, pageNumber);
    console.log('userTemplatesViewResponse:', userTemplatesViewResponse);

    if (userTemplatesViewResponse.hasError) {
      console.log('Cant fetch Users templates Data -> ', userTemplatesViewResponse.errorMessage);
      setLoading(false);
    }
    else {
      console.log('res -> ', userTemplatesViewResponse);
      message.success(userTemplatesViewResponse.message, 3);
      setTemplatesData(userTemplatesViewResponse.templates.data);
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

  const handleOmniForm = () => {
    postEditOutletData(true);
  };


  const  postEditOutletData = async (onmiFormCheck = false) => {
    var formValues = form.getFieldsValue();
    console.log("changed", formValues);


    var editOutletPostData = {};
    editOutletPostData.store_name = formValues.outlet;
    if (onmiFormCheck) { editOutletPostData.store_brand_id = formValues.brand; }
    if (onmiFormCheck) { editOutletPostData.store_location_id = formValues.location; }
    editOutletPostData.currency = selectedCurrencyObj;
    editOutletPostData.template_id = formValues.template;
    editOutletPostData.store_random = selectedStoreObj.store_random;
    editOutletPostData.store_location = formValues.address;
    editOutletPostData.store_id = selectedStoreObj.store_id;
    
    const hide = message.loading('Saving Changes in progress..', 0);
    const editOutletResponse = await SetupApiUtil.editOutlet(editOutletPostData);
    console.log('editOutletResponse:', editOutletResponse);

    if (editOutletResponse.hasError) {
      console.log('Cant Edit Template -> ', editOutletResponse.errorMessage);
      setTimeout(hide, 1500);
    }
    else {
      console.log('res -> ', editOutletResponse);
      message.success(editOutletResponse.message, 3);
      setTimeout(hide, 1000);
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
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    history.push({
      pathname: '/setup/outlets',
      activeKey: 'outlets'
    });
  };




  return (
    <div className='page dashboard'>
      <div style={{ textAlign: "center" }}>
        {loading && <Spin size="large" tip="Loading..." />}
      </div>
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
                    <Select onChange={handleCurrencyChange}>
                      {
                        currenciesData.map((obj, index) => {
                          return (
                            <option key={obj.code} value={obj.code}>
                              <img className="currency-flag-img"
                                src={`/images/flags/${((obj.code).substring(0, 2)).toLowerCase()}.png`} />
                              {obj.name}
                            </option>
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
                    <Select>
                      {
                        templatesData.map((obj, index) => {
                          return (
                            <option key={obj.template_id} value={obj.template_id}>
                              {obj.template_name}
                            </option>
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
                <Button type='secondary'>
                  Cancel
                </Button>

                <Button
                  type='primary'
                  htmlType='submit'
                  className='custom-btn custom-btn--primary'
                >
                  Confirm
                </Button>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header'>
                <h2>Outlet API KEY</h2>
                <p>
                  Token Type: <Badge count={show ? 25 : 0} />
                </p>
              </div>

              <div className='form__row'>
                <div className='form__col form__col--btn'>
                  <Search
                    placeholder='input search text'
                    allowClear
                    enterButton='Copy'
                    size='large'
                  //onSearch={onSearch}
                  />

                  <Button
                    type='primary'
                    icon={<AppstoreAddOutlined />}
                    className='custom-btn custom-btn--primary'
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
                  className='custom-btn custom-btn--primary'
                >
                  Add New
                </Button>

              </div>
            </div>


             {/* Form Section */}
            <div className='form__row'>
              {/* Table */}
              <div className='table'>
                <WebHooksTable pageLimit={paginationLimit} tableData={webHooksData}
                  tableDataLoading={loading}
                  onClickDeleteWebHook={onHandleWebHookDelete} />
              </div>
              {/* Table */}
            </div>

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
              <Button type='secondary'>
                Cancel
              </Button>

              <Button
                type='primary'
                onClick={handleOmniForm}
                className='custom-btn custom-btn--primary'
              >
                Confirm
              </Button>
            </div>
            {/* Form Section */}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default OutletEdit;
