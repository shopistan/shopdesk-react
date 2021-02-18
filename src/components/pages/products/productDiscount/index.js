import React from "react";

import { Form, Input, Button } from "antd";

import { PlusCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const ProductDiscount = () => {
  const { Search } = Input;
  const onSearch = (value) => console.log(value);
  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Product Discount</h1>

        <Button type='primary' icon={<PlusCircleOutlined />}>
          Save
        </Button>
      </div>

      <div className='page__content'>
        <div className='page__form'>
          <Form name='basic' layout='vertical'>
            <div className='form__section'>
              <div className='form__row'>
                <div className='form__col'>
                  <Form.Item
                    label='Search Products'
                    name='sku'
                    rules={[
                      {
                        required: true,
                        message: "Please input SKU",
                      },
                    ]}
                  >
                    <Search
                      placeholder='Search a Product'
                      allowClear
                      enterButton='Search'
                      size='large'
                      loading
                      onSearch={onSearch}
                    />
                  </Form.Item>
                </div>

                <div className='form__col'>
                  <Form.Item
                    label='Discount Percentage'
                    name='sku'
                    rules={[
                      {
                        required: true,
                        message: "Please input SKU",
                      },
                    ]}
                  >
                    <Search
                      placeholder='Discount Percentage'
                      allowClear
                      enterButton='Apply'
                      size='large'
                      icon={<CheckCircleOutlined />}
                      onSearch={onSearch}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>

        <div className='page__table'>{/* Insert Table Here */}</div>
      </div>
    </div>
  );
};

export default ProductDiscount;
