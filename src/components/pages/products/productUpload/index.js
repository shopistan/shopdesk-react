import React, { useState, useEffect } from "react";

import { Form, Upload, Button, message } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import UrlConstants from '../../../../utils/constants/url-configs';
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import Joi_sd from '../../../../utils/helpers/joi-custom';


const ProductUpload = () => {
  const [fileList, setFileList] = useState([]);


  var bulkProcess = {
    process: "Started",
    totalCount: 0,
    doneCount: 0,
    chunk: 50
  };


  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };


  const handleUpload = async (values) => {
    console.log("Success:", values);
    console.log(fileList[0]);   //imp
    var file = fileList[0];

    if (file && fileExtention(file.name) == 'csv') {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function (evt) {
        // code to convert file data and render in json format
        var jsonOutput = csvJSON(evt.target.result);
        console.log("json-out", jsonOutput);
        jsonOutput = JSON.parse((jsonOutput));
        console.log("json-out-aprse", jsonOutput);
        
        /*-------------------------------*/
        
        let opt = {
          lineCode: "string",
          itemCode: "string",
          foreignName: "string",
          price: "float",
          taxValue: "float",
          taxName: "string",
          categoryName: "string",
          initialQuantity: "int",
          itemDescription: "string",
          variant: "bool",
          SKU: "string",
          variantName1: "string",
          variantName2: "string",
          variantValue1: "string",
          variantValue2: "string",
          attributes: "string"

        };
        let checkFile = new Joi_sd(opt);
        if (checkFile.validate(jsonOutput[0]) == false) {
          message.error("Invalid file schema", 2);
          return;
        }

        console.log(jsonOutput);
        bulkProcess.totalCount = jsonOutput.length;

        /*json.forEach(e => {
          e.tax = {
            name: e.taxName,
            value: e.taxValue
          };
        }); */
        bulkProcess.queue = jsonOutput;

        uploadChunk(
          bulkProcess.queue.splice(0, bulkProcess.chunk)
        );
  
        //document.getElementById("fileContents").innerHTML = csvJSON(evt.target.result);
      }
      reader.onerror = function (evt) {
        message.error('error reading file');
      }
    }
    else {
      message.error('Not a csv file');
    }

  };



  async function uploadChunk(products) {

    const productsBulkUploadResponse = await ProductsApiUtil.productsBulkUpload(products);
    console.log('productsBulkUploadResponse:', productsBulkUploadResponse);

    if (productsBulkUploadResponse.hasError) {
      console.log('Cant Upload Bulk products -> ', productsBulkUploadResponse.errorMessage);
      message.error('Cant Upload Bulk products ', 3);
      //setLoading(false);
    }
    else {
      console.log('res -> ', productsBulkUploadResponse);
      //message.success(productsBulkUploadResponse.message, 3);
      //setLoading(false);
      if (bulkProcess.queue.length > 0) {
        uploadChunk(bulkProcess.queue.splice(0, bulkProcess.chunk));
      } else {
        message.success(productsBulkUploadResponse.message, 3);
      }
    }

  };


  function csvJSON(csv) {
    var lines = csv.split('\r');
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length-1; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {

        if(headers[j]=='attributes'){ obj[headers[j]] = [{key: 'Build',value:'Wood'},{key: 'HS Code', value:'000'}]; }
        else{obj[headers[j]] = currentline[j].replace(/\n/ig, ''); }

      }
      result.push(obj);
    }
    return JSON.stringify(result);
  }


  function fileExtention(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }


  const imageUploadProps = {
    beforeUpload: file => {
      console.log(file);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (isJpgOrPng) {
        message.error('You cant only upload JPG/PNG file!');
      }
      else { setFileList([file]); }

      return false;
    },
    fileList,
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
            //initialValues={{ }}
            onFinish={handleUpload}
            onFinishFailed={onFinishFailed}
          >
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item  >
                  <Upload {...imageUploadProps}
                    listType="picture"
                  >
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
                    //onClick={handleUpload}
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
