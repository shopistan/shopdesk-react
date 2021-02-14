import React, { useState } from "react";
import "./style.scss";

import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  SendOutlined,
  BankOutlined,
  ShopOutlined,
  UserOutlined,
  BarcodeOutlined,
  LaptopOutlined,
  StockOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  TagsOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const AppShell = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const history = useHistory();

  const { Header, Sider, Content } = Layout;
  const { SubMenu } = Menu;

  const toggle = () => {
    setCollapsed((s) => !s);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2>Shopdesk</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={(e) => {
            if (e.key === "1") {
              history.push("/dashboard");
            } else if (e.key === "2") {
              history.push("/categories");
            }
          }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<TagsOutlined />}>
            Categories
          </Menu.Item>
          <Menu.Item key="3" icon={<SendOutlined />}>
            Suppliers
          </Menu.Item>
          <Menu.Item key="4" icon={<BankOutlined />}>
            Taxes
          </Menu.Item>
          <Menu.Item key="5" icon={<ShopOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="6" icon={<UserOutlined />}>
            Customers
          </Menu.Item>
          <Menu.Item key="7" icon={<BarcodeOutlined />}>
            Couriers
          </Menu.Item>
          <SubMenu key="sub1" icon={<LaptopOutlined />} title="Register">
            <Menu.Item key="8">Sell</Menu.Item>
            <Menu.Item key="9">Sales History</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<StockOutlined />} title="Stock Control">
            <Menu.Item key="10">Purchase Orders</Menu.Item>
            <Menu.Item key="11">Inventory Transfers</Menu.Item>
            <Menu.Item key="12">Stock Adjustment</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<ApartmentOutlined />} title="Ecommerce">
            <Menu.Item key="13">Orders</Menu.Item>
            <Menu.Item key="14">Inventory Sync</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<BarChartOutlined />} title="Reports">
            <Menu.Item key="14">Sales Summary</Menu.Item>
            <Menu.Item key="16">Inventory Dump</Menu.Item>
            <Menu.Item key="17">Product History</Menu.Item>
            <Menu.Item key="18">Omni Sales Summary</Menu.Item>
            <Menu.Item key="19">Category Wise</Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<SettingOutlined />} title="Setup">
            <Menu.Item key="20">Outlets</Menu.Item>
            <Menu.Item key="21">Users</Menu.Item>
            <Menu.Item key="22">Receipt Templates</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="header site-layout-background">
          <div className="header__menu-btn">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggle,
              }
            )}
          </div>

          <div className="header__content">
            <div className="outlet">
              <h2>Outlet Name</h2>
            </div>
            <div className="user">
              <h2>Username</h2>
            </div>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppShell;
