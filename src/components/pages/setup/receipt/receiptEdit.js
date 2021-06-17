import React, { useState, useEffect } from "react";
import "../style.scss";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, message, Upload, Checkbox, Spin } from "antd";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import * as SetupApiUtil from '../../../../utils/api/setup-api-utils';
import {
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";


function ReceiptEdit(props) {
  const history = useHistory();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [loading, setLoading] = useState(true);
  const [productImagePreviewSource, setproductImagePreviewSource] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const [templateLastImg, setTemplateLastImg] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { template_id = {} } = match !== undefined && match.params;



  useEffect(() => {
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
      }, 2000);
    }

  }, []);



  const getTemplateData = async (templateId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getTepmlateResponse = await SetupApiUtil.getTemplate(templateId);
    console.log('getTepmlateResponse:', getTepmlateResponse);

    if (getTepmlateResponse.hasError) {
      console.log('Cant get template Data -> ', getTepmlateResponse.errorMessage);
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";
    }
    else {
      console.log('res -> ', getTepmlateResponse);
      var receivedTemplateData = getTepmlateResponse.template;
      //message.success(getTepmlateResponse.message, 3);
      setTemplateData(receivedTemplateData);
      setTemplateLastImg(receivedTemplateData.template_image);
      /*-----setting template data to fields value------*/
      form.setFieldsValue({
        template_name: receivedTemplateData.template_name,
        template_header: removeHTML(receivedTemplateData.template_header),
        template_footer: removeHTML(receivedTemplateData.template_footer),
      });

      /*-----setting template data to fields value------*/
      setLoading(false);
      document.getElementById('app-loader-container').style.display = "none";

    }
  }


  const onFinish = async (values) => {
    var formValues = form.getFieldsValue();
    //console.log("changed", formValues);

    var editTemplatePostData = {};
    editTemplatePostData.img = productImagePreviewSource;
    if (isImageUpload) { editTemplatePostData.product_image = productImagePreviewSource; }
    editTemplatePostData.template_image = templateLastImg;
    editTemplatePostData.template_header = formValues.template_header;
    editTemplatePostData.template_name = formValues.template_name;
    editTemplatePostData.template_footer = formValues.template_footer;
    editTemplatePostData.user_id = templateData.user_id;
    editTemplatePostData.template_id = templateData.template_id;


    if (buttonDisabled === false) {
      setButtonDisabled(true);}

    document.getElementById('app-loader-container').style.display = "block";
    const editTemplateResponse = await SetupApiUtil.editTemplate(editTemplatePostData);
    console.log('editTemplateResponse:', editTemplateResponse);

    if (editTemplateResponse.hasError) {
      console.log('Cant Edit Template -> ', editTemplateResponse.errorMessage);
      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(editTemplateResponse.errorMessage, 2);
    }
    else {
      console.log('res -> ', editTemplateResponse);
      document.getElementById('app-loader-container').style.display = "none";
      //message.success(editTemplateResponse.message, 1);
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
      setFileList([]);
      setTemplateLastImg(productImagePreviewSource);
      setproductImagePreviewSource(ImageUploadResponse.upload_data);
      setIsImageUpload(true);
      document.getElementById('app-loader-container').style.display = "none";
      //message.success(ImageUploadResponse.message, 3);
    }

  };


  const imageUploadProps = {
    beforeUpload: file => {
      setFileList([file]);

      return false;
    },
    fileList,
  };


  const onRemoveImage = (file) => {
    setFileList([]);
  };


  function removeHTML(str) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    history.push({
      pathname: '/setup/receipts-templates',
      activeKey: 'receipts-templates',
    });
  };


  var ProductImageSrc = `${productImagePreviewSource || templateData.template_image}`;  //imp to set image source

  //console.log(templateData);


  return (
    <div className="page dashboard">
      
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />Edit Template</h1>
      </div>


      {!loading &&
      <div className="page__content">
        <div className="page__form">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            //initialValues={{ }}
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
              <Button type="secondary" onClick={handleCancel}>
                Cancel
              </Button>

              <Button type="primary"
                htmlType="submit"
                disabled={buttonDisabled}
                className='custom-btn custom-btn--primary'
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>}
    </div>
  );
}

export default ReceiptEdit;
