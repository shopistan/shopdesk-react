import React, { useState } from "react";
import "./style.scss";

// Ant Design
import { Layout, Avatar, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";

// Custom Components
import SideMenu from "../../molecules/menu";

const AppShell = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const { Header, Sider, Content } = Layout;

  const toggle = () => {
    setCollapsed((s) => !s);
  };

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
              <h2>Username</h2>
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
