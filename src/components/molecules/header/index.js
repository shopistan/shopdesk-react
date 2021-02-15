import React, { useState } from "react";

import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

const header = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed((s) => !s);
  };

  return (
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
  );
};

export default header;
