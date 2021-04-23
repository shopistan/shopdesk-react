import React, { useEffect, useState } from "react";
import { Tabs, Menu, Dropdown, Button } from "antd";
import { ProfileOutlined, DownOutlined } from "@ant-design/icons";
import Outlets from "./outlets";
import Receipts from "./receipt";
import Users from "./users";
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs;


const Setup = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState("");


  useEffect(() => {
    if (history.location.activeKey) {
      setCurrentTab(history.location.activeKey);
    }
    else {
      //console.log(window.location.pathname);
      var path = (window.location.pathname).split("/");
      setCurrentTab(path[2]);
    }


  }, [history.location.activeKey]);  //imp to render when history prop changes



  const handletabChange = (key) => {
    //setCurrentTab(key);  // previous imp
    history.push({
      pathname: `/setup/${key}`,
      activeKey: key
    })
  };


  const SetupMenu = (
    <Menu>
      <Menu.Item key='0' onClick={() => history.push({ pathname: "/setup/outlets/add" })}>
        New Outlet
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='1' onClick={() => history.push({ pathname: "/setup/users/add" })}>
        New User
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='2' onClick={() => history.push({ pathname: "/setup/receipts-templates/add" })}>
        New Template
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );




  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Setup</h1>
        <div className='page__header__buttons'>
          <Dropdown overlay={SetupMenu} placement="bottomCenter"
            trigger={["click"]}>
            <Button
              type='Default'
              icon={<DownOutlined />}
              onClick={(e) => e.preventDefault()}
            >
              More <ProfileOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>


      <div className="page__content">
        <Tabs activeKey={currentTab} onChange={handletabChange}>
          <TabPane tab="Outlets" key="outlets">
            <Outlets />
          </TabPane>
          <TabPane tab="Users" key="users">
            <Users />
          </TabPane>
          <TabPane tab="Receipt Templates" key="receipts-templates">
            <Receipts />
          </TabPane>
        </Tabs>
      </div>
    </div>

  );
}

export default Setup;
