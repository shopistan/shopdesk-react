import React from "react";
import { Form, Input, Button } from "antd";
import { useHistory } from 'react-router-dom';
import { addCategory } from "../../../../utils/APIGeneric/DataRequests";


const CategoryAdd = () => {
  const history = useHistory();

  const onFinish = async (values) => {
    console.log("Success:", values);

    const res = await addCategory({ "name": values.category_name });
        if (res.fail) {
            console.log('Cant add new Category -> ', res);
        }
        else {
            console.log('res -> ', res);
            history.push({
                pathname: '/categories',
            });
        }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h2>New Category</h2>
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
            <div className='form__row'>
              <div className='form__col'>
                <Form.Item
                  label='Category Name'
                  name='category_name'
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

              <div className='form__col form__col--button'>
                <Form.Item className='u-width-100'>
                  <Button type='primary' htmlType='submit'>
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
