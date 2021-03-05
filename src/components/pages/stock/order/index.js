import React from "react";

import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Space,
  Switch,
} from "antd";

import {
  CloseOutlined,
  CheckOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

function onChange(date, dateString) {
  console.log(date, dateString);
}

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const PurchaseOrder = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="page stock-add">
      <div className="page__header">
        <h1>New Purchase Order</h1>
      </div>

      <div className="page__content">
        <div className="page__form">
          <Form
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* Form Section */}
            <div className="form__section">
              <div className="form__section__header">
                <h2>Details</h2>
              </div>

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Name / reference"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input Name / reference",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item
                    label="Supplier"
                    name="supplier"
                    rules={[
                      {
                        required: true,
                        message: "Please input product name",
                      },
                    ]}
                  >
                    <Select defaultValue="lucy" onChange={handleChange}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Name / reference"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input Name / reference",
                      },
                    ]}
                  >
                    <DatePicker onChange={onChange} />
                  </Form.Item>
                </div>

                <div className="form__col"></div>
              </div>
              {/* Row */}
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className="form__section">
              <div className="form__section__header">
                <div className="switch__row">
                  <h2>Bulk Order</h2>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form__col">
                  <Form.Item>
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item>
                    <Button type="primary" icon={<DownloadOutlined />}>
                      Add Product
                    </Button>
                  </Form.Item>
                </div>
              </div>

              <div className="form__row form__row--btn">
                <div className="form__col">
                  <Form.Item>
                    <Button type="primary">Done</Button>
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className="form__section">
              <div className="form__section__header">
                <div className="switch__row">
                  <h2>Order Products</h2>
                </div>
              </div>

              <div className="form__row">
                <div className="form__col">
                  <Form.Item
                    label="Name / reference"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input Name / reference",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="form__col">
                  <Form.Item
                    label="Name / reference"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input Name / reference",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Button type="primary">Done</Button>
                </div>
              </div>
            </div>
            {/* Form Section */}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
