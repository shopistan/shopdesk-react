import React, { useState, useEffect } from "react";
import "./style.scss";
import { useHistory } from "react-router-dom";

// Ant Design
import { Layout, Avatar, Button, Dropdown, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";

// Custom Components
import SideMenu from "../../molecules/menu";
import {
  getDataFromLocalStorage,
  clearDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";

const AppShell = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const { Header, Sider, Content } = Layout;

  const history = useHistory();

  const toggle = () => {
    setCollapsed((s) => !s);
  };

  const toggleLogout = () => {
    clearDataFromLocalStorage();
    history.push({
      pathname: "/signin",
    });
  };

  const toggleOutlet = () => {
    history.push({
      pathname: "/outlets",
    });
  };

  var storeObj = null;
  var readFromLocalStorage = getDataFromLocalStorage(
    Constants.USER_DETAILS_KEY
  );
  readFromLocalStorage = readFromLocalStorage.data
    ? readFromLocalStorage.data
    : null;
  if (readFromLocalStorage) {
    if (
      checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
    ) {
      var foundStoreObj = readFromLocalStorage.auth.storeInfo.find((obj) => {
        return obj.store_id === readFromLocalStorage.auth.current_store;
      });
      if (foundStoreObj) {
        storeObj = foundStoreObj;
      }
    } else {
      storeObj = null;
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key='0'>
        <a>Report Bugs</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='1' onClick={toggleOutlet}>
        Switch Outlet
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='2' onClick={toggleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className='site-layout'>
      <Sider trigger={null} collapsible collapsed={collapsed} className='sider'>
        <div className='logo'>
          <h2>S</h2>
        </div>
        <SideMenu />
      </Sider>

      <div className='mobile__menu'>
        <div className='logo'>
          <h2>S</h2>
        </div>
        <SideMenu />
      </div>
      <Layout className='content-layout'>
        {readFromLocalStorage && (
          <Header className='header site-layout-background'>
            <div className='header__menu-btn'>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: toggle,
                }
              )}
            </div>

            <div className='header__mob-menu-btn'>
              <Button
                type='primary'
                shape='circle'
                icon={<MenuOutlined />}
                onClick={(e) => {
                  let mobile_menu = document.querySelector(".mobile__menu");
                  let content_body = document.querySelector(".content-layout");

                  mobile_menu.classList.toggle("mob_menu_on");
                  content_body.classList.toggle("mobile_menu_on_body");
                }}
              />
            </div>
            <span style={{ borderLeft: "2px solid #000" }}></span>

            <div className='header__content'>
              <div className='outlet'>
                <h2>{storeObj ? storeObj.store_name : "N/A - "}</h2>
                <span>
                  <small>
                    <a onClick={toggleOutlet} className='outlet__btn'>
                      <span className='outlet-name'> Switch outlet </span>
                    </a>
                  </small>
                </span>
              </div>

              <div className='user'>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    className='user-dropdown-link'
                    onClick={(e) => e.preventDefault()}
                  >
                    <span> Hi, user </span> <DownOutlined />
                  </a>
                </Dropdown>
                <Avatar
                  // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  src='images/ui.png'
                  className='user__avatar'
                />
              </div>
            </div>
          </Header>
        )}
        <Content className='site-layout-background'>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;
