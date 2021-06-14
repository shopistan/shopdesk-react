import React, { useState, useEffect } from "react";
import "../../style.scss";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, message, Upload } from "antd";
import * as ProductsApiUtil from '../../../../../utils/api/products-api-utils';
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import {
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";


function ReceiptAdd() {
  const history = useHistory();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [productImagePreviewSource, setproductImagePreviewSource] = useState("");
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);



  useEffect(() => {

  }, []);


  const onFinish = async (values) => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);

    /*if (!productImagePreviewSource) {
      message.error("Please select template Logo", 4);
      return;
    }*/ //not mandatory to include

    var addTemplatePostData = {};
    addTemplatePostData.img = productImagePreviewSource;
    addTemplatePostData.name = formValues.template_name;
    if(isImageUpload){addTemplatePostData.product_image = productImagePreviewSource;}
    addTemplatePostData.header = formValues.template_header;
    addTemplatePostData.footer = formValues.template_footer;


    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    const addTemplateResponse = await SetupApiUtil.addTemplate(addTemplatePostData);
    console.log('addTemplateResponse:', addTemplateResponse);

    if (addTemplateResponse.hasError) {
      console.log('Cant Add Template -> ', addTemplateResponse.errorMessage);
      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(addTemplateResponse.errorMessage, 2);
    }
    else {
      console.log('res -> ', addTemplateResponse);
      document.getElementById('app-loader-container').style.display = "none";
      //message.success(addTemplateResponse.message, 1);
      setTimeout(() => {
        history.push({
          pathname: '/setup/receipts-templates',
          activeKey: 'receipts-templates'
        });
      }, 1200);
    }

  };


  const handleUpload = async () => {
    //console.log(fileList[0]);   //imp
    document.getElementById('app-loader-container').style.display = "block";
    const ImageUploadResponse = await ProductsApiUtil.imageUpload(fileList[0]);
    console.log('ImageUploadResponse:', ImageUploadResponse);
    if (ImageUploadResponse.hasError) {
      console.log('Product Image Cant Upload -> ', ImageUploadResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      message.error('Product  Image Cant Upload', 3);
    }
    else {
      console.log('res -> ', ImageUploadResponse);
      document.getElementById('app-loader-container').style.display = "none";
      //message.success(ImageUploadResponse.message, 3);
      setFileList([]);
      setproductImagePreviewSource(ImageUploadResponse.upload_data);
      setIsImageUpload(true);
    }

  };


  const imageUploadProps = {

    beforeUpload: file => {
      //console.log("inside-upload");
      setFileList([file]);

      return false;
    },
    fileList,
  };


  const onRemoveImage = (file) => {
    setFileList([]);
  };


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    history.push({
      pathname: '/setup/receipts-templates',
      activeKey: 'receipts-templates'
    });
  };


  var ProductImageSrc = `${productImagePreviewSource}`;  //imp to set image source


  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />New Receipt</h1>
      </div>

      <div className="page__content">
        <div className="page__form">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >

            {/* Row */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Name'
                  name='template_name'
                  rules={[
                    {
                      required: true,
                      message: "Please input template name",
                    },
                  ]}
                >
                  <Input placeholder="Template Name" />
                </Form.Item>
              </div>
            </div>
            {/* Row */}


            {/* Row */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Logo'
                  name='template_logo'
                  rules={[
                    {
                      required: false,
                      message: "",
                    },
                  ]}
                >
                  <Upload {...imageUploadProps} onRemove={onRemoveImage}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </div>

              <div className='form__col form__col--button'>
                <Form.Item className='u-width-100'>
                  <Button type='default' onClick={handleUpload}>
                    Upload
                    </Button>
                </Form.Item>
              </div>

            </div>
            {/* Row */}

            {/* Row */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item>
                  <img className='thumbnail' src={ProductImageSrc}></img>
                </Form.Item>
              </div>

            </div>
            {/* Row */}

            {/* Row */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Template Header'
                  name='template_header'
                  rules={[
                    {
                      required: true,
                      message: "Please input template header",
                    },
                  ]}
                >
                  <TextArea rows={6} />
                </Form.Item>
              </div>
            </div>
            {/* Row */}

            {/* Row */}
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Template Footer'
                  name='template_footer'
                  rules={[
                    {
                      required: true,
                      message: "Please input template footer",
                    },
                  ]}
                >
                  <TextArea rows={6} />
                </Form.Item>
              </div>
            </div>
            {/* Row */}


            <div className="form__row--footer">
              <Button type="secondary" onClick={handleCancel} >
                Cancel
              </Button>

              <Button type="primary"
                htmlType="submit"
                disabled={buttonDisabled}
                className='custom-btn custom-btn--primary'
              >
                Add
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ReceiptAdd;
