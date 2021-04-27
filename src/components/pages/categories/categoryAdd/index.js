import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import * as CategoriesApiUtil from "../../../../utils/api/categories-api-utils";
import BackButton from "../../../atoms/backButton";

const CategoryAdd = () => {
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);



  const onFinish = async (values) => {
    if (buttonDisabled === false) {
      setButtonDisabled(true);}
    console.log("Success:", values);
    const categoryAddResponse = await CategoriesApiUtil.addCategory(
      values.category_name
    );
    console.log("categoryAddResponse:", categoryAddResponse);
    if (categoryAddResponse.hasError) {
      console.log(
        "Cant add new Category -> ",
        categoryAddResponse.errorMessage
      );
      message.error(categoryAddResponse.errorMessage, 3);
      setButtonDisabled(false);
    } else {
      console.log("res -> ", categoryAddResponse);
      message.success(categoryAddResponse.message, 3);
      setTimeout(() => {
        history.push({
          pathname: "/categories",
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
        <h1>
          <BackButton />
          New Category
        </h1>
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
                  label="Category Name"
                  name="category_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input category name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="form__col form__col--button">
                <Form.Item className="u-width-100">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="custom-btn custom-btn--primary"
                    disabled={buttonDisabled}
                  >
                    Add
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

export default CategoryAdd;
