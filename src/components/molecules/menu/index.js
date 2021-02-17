import React from "react";
import { useHistory } from "react-router-dom";

import { Menu } from "antd";
import {
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

const SideMenu = () => {
  const history = useHistory();

  const { SubMenu } = Menu;

  return (
    <Menu
      theme='dark'
      mode='inline'
      defaultSelectedKeys={["dashboard"]}
      onClick={(e) => {
        if (e.key === "dashboard") {
          history.push("/dashboard");
        } else if (e.key === "categories") {
          history.push("/categories");
        } else if (e.key === "suppliers") {
          history.push("/suppliers");
        } else if (e.key === "signup") {
          history.push("/signup");
        } else if (e.key === "signin") {
          history.push("/signin");
        } else if (e.key === "outlet") {
          history.push("/outlet");
        }
      }}
    >
      <Menu.Item key='dashboard' icon={<DashboardOutlined />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key='categories' icon={<TagsOutlined />}>
        Categories
      </Menu.Item>
      <Menu.Item key='suppliers' icon={<SendOutlined />}>
        Suppliers
      </Menu.Item>
      <Menu.Item key='4' icon={<BankOutlined />}>
        Taxes
      </Menu.Item>
      <Menu.Item key='5' icon={<ShopOutlined />}>
        Products
      </Menu.Item>
      <Menu.Item key='6' icon={<UserOutlined />}>
        Customers
      </Menu.Item>
      <Menu.Item key='7' icon={<BarcodeOutlined />}>
        Couriers
      </Menu.Item>
      <SubMenu key='sub1' icon={<LaptopOutlined />} title='Register'>
        <Menu.Item key='8'>Sell</Menu.Item>
        <Menu.Item key='9'>Sales History</Menu.Item>
      </SubMenu>
      <SubMenu key='sub2' icon={<StockOutlined />} title='Stock Control'>
        <Menu.Item key='10'>Purchase Orders</Menu.Item>
        <Menu.Item key='11'>Inventory Transfers</Menu.Item>
        <Menu.Item key='12'>Stock Adjustment</Menu.Item>
      </SubMenu>
      <SubMenu key='sub3' icon={<ApartmentOutlined />} title='Ecommerce'>
        <Menu.Item key='13'>Orders</Menu.Item>
        <Menu.Item key='14'>Inventory Sync</Menu.Item>
      </SubMenu>
      <SubMenu key='sub4' icon={<BarChartOutlined />} title='Reports'>
        <Menu.Item key='14'>Sales Summary</Menu.Item>
        <Menu.Item key='16'>Inventory Dump</Menu.Item>
        <Menu.Item key='17'>Product History</Menu.Item>
        <Menu.Item key='18'>Omni Sales Summary</Menu.Item>
        <Menu.Item key='19'>Category Wise</Menu.Item>
      </SubMenu>
      <SubMenu key='sub5' icon={<SettingOutlined />} title='Setup'>
        <Menu.Item key='20'>Outlets</Menu.Item>
        <Menu.Item key='21'>Users</Menu.Item>
        <Menu.Item key='22'>Receipt Templates</Menu.Item>
      </SubMenu>
      <Menu.Item key='signup' icon={<SendOutlined />}>
        Sign Up
      </Menu.Item>
      <Menu.Item key='signin' icon={<BankOutlined />}>
        Sign In
      </Menu.Item>
      <Menu.Item key='outlet' icon={<BankOutlined />}>
        Outlet
      </Menu.Item>
    </Menu>
  );
};

export default SideMenu;
