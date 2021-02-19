import React, { useState } from "react";
import "./style.scss";
import { useHistory } from 'react-router-dom';

// Ant Design
import { Layout, Avatar, Button, Dropdown, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";

// Custom Components
import SideMenu from "../../molecules/menu";
import { clearDataFromLocalStorage  } from "../../../utils/local-storage/local-store-utils";

const AppShell = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const { Header, Sider, Content } = Layout;

  const history = useHistory();

  const toggle = () => {
    setCollapsed((s) => !s);
  };
  
  const toggleLogout= () => {
    clearDataFromLocalStorage();
    history.push({
      pathname: '/signin',
    });
  };


  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a>Report Bugs</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <a>switch Outlet</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={toggleLogout}>Logout</Menu.Item>
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

          <div className='header__content'>
            <div className='outlet'>
              <h2>Outlet Name</h2>
            </div>
            <div className='user'>
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <span > Hi, user </span> <DownOutlined />
                </a>
              </Dropdown>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                className='user__avatar'
              />
            </div>
          </div>
        </Header>
        <Content className='site-layout-background'>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;
