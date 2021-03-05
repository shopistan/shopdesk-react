import React, { useState } from "react";
import "./style.scss";

import { Form, Input, Button, Modal } from "antd";
import {
  EditOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

function Sell() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='page sell'>
      {/* Left */}
      <div className='info'>
        <Form
          name='basic'
          layout='vertical'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label='Search for products'>
            <Input placeholder='Search Product' />
          </Form.Item>
          <Form.Item label='Courier'>
            <Input placeholder='input placeholder' />
          </Form.Item>
          <Form.Item label='Invoice Note'>
            <Input placeholder='input placeholder' />
          </Form.Item>
          <Form.Item label='Tax Category'>
            <Input placeholder='input placeholder' />
          </Form.Item>
        </Form>
      </div>
      {/* Left */}

      {/* Right */}
      <div className='checkout'>
        <Form
          name='basic'
          layout='vertical'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className='header'>
            <h2>Checkout</h2>

            <div className='header__btns'>
              <Button type='primary'>Park Sale</Button>
              <Button>Delete Sale</Button>
            </div>
          </div>
          <Form.Item>
            <Input placeholder='Select a Customer' />
          </Form.Item>

          <div className='table'></div>

          <div className='cost'>
            <div className='cost__wrapper'>
              <div className='cost__left'>
                <div className='cost__box'>
                  <h3>Subtotal</h3>
                  <span>105</span>
                </div>

                <Form.Item label='Discount'>
                  <Input placeholder='0' />
                </Form.Item>

                <div className='cost__box'>
                  <h3>Tax</h3>
                  <span>2.42</span>
                </div>

                <div className='cost__box'>
                  <Button
                    type='primary'
                    icon={<EditOutlined />}
                    onClick={showModal}
                  >
                    MOP
                  </Button>
                  <span>Online</span>
                </div>

                <Modal
                  title='Select mode of payment'
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <div className='modal__content'>
                    <Button
                      type='primary'
                      icon={<DollarCircleOutlined />}
                      onClick={showModal}
                    >
                      Cash
                    </Button>

                    <Button
                      type='primary'
                      icon={<CreditCardOutlined />}
                      onClick={showModal}
                    >
                      Credit Card
                    </Button>

                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={showModal}
                    >
                      Online
                    </Button>
                  </div>
                </Modal>
              </div>
              <div className='cost__right'>
                <Form.Item label='Paid'>
                  <Input placeholder='0' />
                </Form.Item>

                <div className='cost__box'>
                  <h3>Change</h3>
                  <span>2.42</span>
                </div>
              </div>
            </div>
            <Form.Item>
              <Button type='primary' htmlType='submit' className='cost__btn'>
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      {/* Right */}
    </div>
  );
}

export default Sell;
