import React from "react";

import { Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const Menu = () => {
  const [collapsed, setCollapsed] = useState(false);

  const history = useHistory();

  const { SubMenu } = Menu;

  const toggle = () => {
    setCollapsed((s) => !s);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      onClick={(e) => {
        console.log(e);
        if (e.key === "1") {
          history.push("/categories");
          console.log(e);
        }
      }}
    >
      <Menu.Item key="1" icon={<UserOutlined />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="2" icon={<VideoCameraOutlined />}>
        Categories
      </Menu.Item>
      <Menu.Item key="3" icon={<UploadOutlined />}>
        Suppliers
      </Menu.Item>
      <Menu.Item key="4" icon={<UploadOutlined />}>
        Taxes
      </Menu.Item>
      <Menu.Item key="5" icon={<UploadOutlined />}>
        Products
      </Menu.Item>
      <Menu.Item key="6" icon={<UploadOutlined />}>
        Customers
      </Menu.Item>
      <Menu.Item key="7" icon={<UploadOutlined />}>
        Couriers
      </Menu.Item>
      <SubMenu key="sub1" icon={<SettingOutlined />} title="Register">
        <Menu.Item key="8">Sell</Menu.Item>
        <Menu.Item key="9">Sales History</Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<SettingOutlined />} title="Stock Control">
        <Menu.Item key="10">Purchase Orders</Menu.Item>
        <Menu.Item key="11">Inventory Transfers</Menu.Item>
        <Menu.Item key="12">Stock Adjustment</Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<SettingOutlined />} title="Ecommerce">
        <Menu.Item key="13">Orders</Menu.Item>
        <Menu.Item key="14">Inventory Sync</Menu.Item>
      </SubMenu>
      <SubMenu key="sub3" icon={<SettingOutlined />} title="Reports">
        <Menu.Item key="14">Sales Summary</Menu.Item>
        <Menu.Item key="16">Inventory Dump</Menu.Item>
        <Menu.Item key="17">Product History</Menu.Item>
        <Menu.Item key="18">Omni Sales Summary</Menu.Item>
        <Menu.Item key="19">Category Wise</Menu.Item>
      </SubMenu>
      <SubMenu key="sub4" icon={<SettingOutlined />} title="Setup">
        <Menu.Item key="20">Outlets</Menu.Item>
        <Menu.Item key="21">Users</Menu.Item>
        <Menu.Item key="22">Receipt Templates</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Menu;
