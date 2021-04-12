import React, { useEffect, useState } from "react";
import { Tabs, Menu, Dropdown, Button } from "antd";
import { ProfileOutlined, DownOutlined } from "@ant-design/icons";
// import Outlets from "./outlets";
// import Receipts from "./receipt";
// import Users from "./users";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;

const Ecommerce = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    if (history.location.activeKey) {
      setCurrentTab(history.location.activeKey);
    } else {
      console.log(window.location.pathname);
      var path = window.location.pathname.split("/");
      setCurrentTab(path[2]);
    }
  }, [history.location.activeKey]); //imp to render when history prop changes

  const handletabChange = (key) => {
    //setCurrentTab(key);  // previous imp
    history.push({
      pathname: `/setup/${key}`,
      activeKey: key,
    });
  };

  const SetupMenu = (
    <Menu>
      <Menu.Item key="0" onClick={() => history.push({ pathname: "/" })}>
        Menu Item
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={() => history.push({ pathname: "/" })}>
        Menu Item
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={() => history.push({ pathname: "/" })}>
        Menu Item
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  return (
    <div className="page setup">
      <div className="page__header">
        <h1>Ecommerce</h1>
        <div className="page__header__buttons">
          <Dropdown overlay={SetupMenu} trigger={["click"]}>
            <Button
              type="Default"
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
          <TabPane tab="All Orders" key="all_orders">
            {/* <Outlets /> */}
          </TabPane>
          <TabPane tab="Sale Orders" key="sale_orders">
            {/* <Users /> */}
          </TabPane>
          <TabPane tab="Completed" key="completed_orders">
            {/* <Receipts /> */}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Ecommerce;
