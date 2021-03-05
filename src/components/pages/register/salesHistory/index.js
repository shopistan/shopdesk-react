import React from "react";
// import "../style.scss";

import { Button, Tabs } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const SalesHistory = () => {
  const [show, setShow] = React.useState(true);

  function callback(key) {
    console.log(key);
  }

  return (
    <div className='page reports'>
      <div className='page__header'>
        <h1>Sale History</h1>

        <Button type='primary' icon={<PlusCircleOutlined />}>
          New Sale
        </Button>
      </div>

      <div className='page__content'>
        <Tabs defaultActiveKey='1' onChange={callback}>
          <TabPane tab='Continue Sales' key='1'>
            Conitnue Sales
          </TabPane>
          <TabPane tab='Process Returns' key='2'>
            Process Returns
          </TabPane>
          <TabPane tab='All Sales' key='3'>
            All Sales
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesHistory;
