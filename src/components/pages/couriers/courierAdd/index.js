import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import * as CouriersApiUtil from "../../../../utils/api/couriers-api-utils";

const CourierAdd = () => {
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    console.log("Success:", values);
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
      message.error(courierAddResponse.errorMessage, 3);
      setButtonDisabled(false);
    } else {
      console.log("res -> ", courierAddResponse);
      message.success(courierAddResponse.message, 3);
      setTimeout(() => {
        history.push({
          pathname: "/couriers",
        });
      }, 2000);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="page dashboard">
      <div className="page__header">
        <h1>New Couriers</h1>
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
