import React, { useState } from "react";
import "./style.scss";

// Ant Design
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

// Custom Components
import SideMenu from "../../molecules/menu";

const AppShell = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const { Header, Sider, Content } = Layout;

  const toggle = () => {
    setCollapsed((s) => !s);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='logo'>
          <h2>Shopdesk</h2>
        </div>
        <SideMenu />
      </Sider>
      <Layout className='site-layout'>
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

          <div className='header__content'>
            <div className='outlet'>
              <h2>Outlet Name</h2>
            </div>
            <div className='user'>
              <h2>Username</h2>
            </div>
          </div>
        </Header>
        <Content className='site-layout-background'>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;
