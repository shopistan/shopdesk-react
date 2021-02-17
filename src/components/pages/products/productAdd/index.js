import React from "react";
import "./style.scss";

import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
  Space,
  Switch,
} from "antd";

import {
  PlusCircleOutlined,
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const ProductAdd = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function onChange(value) {
    console.log("changed", value);
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

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>New Product</h1>

        <Button type='primary' icon={<PlusCircleOutlined />}>
          Add Product
        </Button>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form
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
              {/* Row */}
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='SKU'
                    name='sku'
                    rules={[
                      {
                        required: true,
                        message: "Please input SKU",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Product Name'
                    name='product_name'
                    rules={[
                      {
                        required: true,
                        message: "Please input product name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='Product Description'
                    name='product_description'
                    rules={[
                      {
                        required: true,
                        message: "Please input category name",
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
                    label='Tax'
                    name='tax'
                    rules={[
                      {
                        required: true,
                        message: "Please input Tax",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      defaultValue={3}
                      onChange={onChange}
                      className='u-width-100'
                    />
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Select Category'
                    name='category'
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Select defaultValue='category1' onChange={handleChange}>
                      <Option value='category1'>Category 1</Option>
                      <Option value='category2'>Category 2</Option>
                      <Option value='disabled' disabled>
                        Disabled
                      </Option>
                      <Option value='category3'>Category 3</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='Purchase Price'
                    name='purchase_price'
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      defaultValue={3}
                      onChange={onChange}
                      className='u-width-100'
                    />
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Sale Price'
                    name='sale_price'
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      defaultValue={3}
                      onChange={onChange}
                      className='u-width-100'
                    />
                  </Form.Item>
                </div>
              </div>
              {/* Row */}

              {/* Row */}
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='Product Image'
                    name='iamge'
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Product Name'
                    name='product_name'
                    rules={[
                      {
                        required: true,
                        message: "Please input product name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              {/* Row */}
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header'>
                <h2>Attributes</h2>
                <p>
                  The attributes allows you to store additional information for
                  products. You cannot search for attributes or filter by an
                  attribute.
                </p>
              </div>

              <div>
                <Form.List name='users' className='attribute'>
                  {(fields, { add, remove }) => (
                    <div className='form__row form__row--full-col'>
                      <div className='form__col'>
                        {fields.map((field) => (
                          <Space
                            key={field.key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align='baseline'
                            className='attribute__wrapper'
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "first"]}
                              fieldKey={[field.fieldKey, "first"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing first name",
                                },
                              ]}
                              className='attribute__input'
                            >
                              <Input placeholder='Key' />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "last"]}
                              fieldKey={[field.fieldKey, "last"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing last name",
                                },
                              ]}
                              className='attribute__input'
                            >
                              <Input placeholder='Value' />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Space>
                        ))}
                      </div>

                      <div className='form__col'>
                        <Form.Item>
                          <Button
                            type='dashed'
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Attribute
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  )}
                </Form.List>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header'>
                <div className='switch__row'>
                  <h2>Inventory Tracking</h2>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                  />
                </div>
              </div>

              <div className='form__row'>
                <div className='form__col'>
                  <p>
                    Leave this on if you want to keep track of your inventory
                    quantities. You'll be able to report on cost of goods sold,
                    product performance, and projected weeks cover, as well as
                    manage your store using inventory orders, transfers and
                    rolling inventory counts.
                  </p>
                </div>
              </div>
            </div>
            {/* Form Section */}

            {/* Form Section */}
            <div className='form__section'>
              <div className='form__section__header'>
                <div className='switch__row'>
                  <h2>Variant Products</h2>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                  />
                </div>
              </div>

              <div className='form__row'>
                <div className='form__col'>
                  <p>
                    These are products that have different versions, like size
                    or color. Turn this on to specify up to two attributes (like
                    color), and unlimited values for each attribute (like green,
                    blue, black).
                  </p>
                </div>
              </div>

              {/* <div className='form__row form__row--variant'>
                <div className='form__col'>
                  <h4>Attribute</h4>
                </div>

                <div className='form__col'>
                  <h4>Value</h4>
                </div>
              </div> */}

              <div className='form__row form__row--variant'>
                <div className='form__col'>
                  <div>
                    <Form.List name='variants'>
                      {(fields, { add, remove }) => (
                        <div className='form__row form__row--full-col'>
                          <div className='form__col'>
                            {fields.map((field) => (
                              <Space
                                key={field.key}
                                style={{ display: "flex", marginBottom: 8 }}
                                align='baseline'
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, "first"]}
                                  fieldKey={[field.fieldKey, "first"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing first name",
                                    },
                                  ]}
                                >
                                  <Input placeholder='Attribute Name' />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "last"]}
                                  fieldKey={[field.fieldKey, "last"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing last name",
                                    },
                                  ]}
                                >
                                  <Input placeholder='Add a Tag' />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(field.name)}
                                />
                              </Space>
                            ))}
                          </div>

                          <div className='form__col'>
                            <Form.Item>
                              <Button
                                type='dashed'
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Variant
                              </Button>
                            </Form.Item>
                          </div>
                        </div>
                      )}
                    </Form.List>
                  </div>
                </div>
              </div>

              <div className='form__row'>
                <div className='form__col'>{/* Import table here */}</div>
              </div>
            </div>
            {/* Form Section */}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;
