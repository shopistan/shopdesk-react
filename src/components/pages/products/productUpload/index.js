import React from "react";

import { Form, Upload, Button } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import UrlConstants from '../../../../utils/constants/url-configs';


const ProductUpload = () => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  var ProductBulkTemplateImageSrc = `${UrlConstants.BASE_URL}/template-files/bulk-products.csv`;  //imp to set image source


  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Bulk Upload</h1>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
            name='basic'
            layout='vertical'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item name='upload' label='' valuePropName='fileList'>
                  <Upload name='logo' action='/upload.do' listType='picture'>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
                <span>Download template file from here.<a href={ProductBulkTemplateImageSrc} download> &nbsp;here</a></span>
              </div>

              <div className='form__col'>
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='u-width-100'
                  >
                    Upload
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;
