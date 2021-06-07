import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import * as CouriersApiUtil from "../../../../utils/api/couriers-api-utils";
import { ArrowLeftOutlined } from "@ant-design/icons";


const CourierAdd = () => {
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  var mounted = true;


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    console.log("Success:", values);
    document.getElementById('app-loader-container').style.display = "block";
    const courierAddResponse = await CouriersApiUtil.addCourier(
      values.courier_name,
      values.courier_code
    );
    console.log("courierAddResponse:", courierAddResponse);
    if (courierAddResponse.hasError) {
      console.log(
        "Cant add a new Courier -> ",
        courierAddResponse.errorMessage
      );
      setButtonDisabled(false);
      document.getElementById('app-loader-container').style.display = "none";
      message.error(courierAddResponse.errorMessage, 3);
    } else {
      console.log("res -> ", courierAddResponse);
      if (mounted) {     //imp if unmounted
        document.getElementById('app-loader-container').style.display = "none";
        message.success(courierAddResponse.message, 1);
        setTimeout(() => {
          history.push({
            pathname: "/couriers",
          });
        }, 1200);
      }
    }
  };


  useEffect(() => {
    return () => {
      mounted = false;
    }
  }, []);


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleCancel = () => {
    history.push({
      pathname: '/couriers',
    });
  };


  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1><Button type="primary" shape="circle" className="back-btn"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel} />New Couriers</h1>
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
            <div className="form__row">
              <div className="form__col">
                <Form.Item
                  label="Courier Name"
                  name="courier_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input courier name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="form__col">
                <Form.Item
                  label="Courier Code"
                  name="courier_code"
                  rules={[
                    {
                      required: true,
                      message: "Please input courier code!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="form__row--footer">
              <Button
                type="primary"
                htmlType="submit"
                className="custom-btn custom-btn--primary"
                disabled={buttonDisabled}
              >
                Add
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CourierAdd;
