import React, { useState, useEffect } from "react";
import "./style.scss";
import { useHistory } from "react-router-dom";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";

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

  var readFromLocalStorage = getDataFromLocalStorage("user");
  readFromLocalStorage = readFromLocalStorage.data
    ? readFromLocalStorage.data
    : null;
  var authenticateDashboard = false;
  if (readFromLocalStorage) {
    console.log(
      checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
    );
    if (
      checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
    ) {
      authenticateDashboard = true;
    } else {
      authenticateDashboard = false;
    }
  }

  const { SubMenu } = Menu;

  return (
    <Menu
      theme="dark"
      mode="inline"
      className="side-menu"
      defaultSelectedKeys={["dashboard"]}
      onClick={(e) => {
        if (e.key === "dashboard") {
          if (readFromLocalStorage && authenticateDashboard) {
            history.push("/dashboard");
          } else {
            history.push("/outlets");
          }
        } else if (e.key === "categories") {
          history.push("/categories");
        } else if (e.key === "suppliers") {
          history.push("/suppliers");
        } else if (e.key === "taxes") {
          history.push("/taxes");
        } else if (e.key === "products") {
          history.push("/products");
        } else if (e.key === "customers") {
          history.push("/customers");
        } else if (e.key === "couriers") {
          history.push("/couriers");
        } else if (e.key === "salesSummary") {
          history.push("/salesSummary");
        } else if (e.key === "inventoryDump") {
          history.push("/inventoryDump");
        } else if (e.key === "productHistory") {
          history.push("/productHistory");
        } else if (e.key === "omniSalesSummary") {
          history.push("/omniSalesSummary");
        } else if (e.key === "categoryWise") {
          history.push("/categoryWise");
        } else if (e.key === "salesHistory") {
          history.push("/register/salesHistory");
        } else if (e.key === "sell") {
          history.push("/register/sell");
        } else if (e.key === "signup") {
          history.push("/signup");
        } else if (e.key === "signin") {
          history.push("/signin");
        } else if (e.key === "outlets" || e.key === "users" || e.key === "receipts") {
          if (e.key === "outlets") {
            history.push({
              pathname: '/setup/outlets',
              activeKey: 'outlets'
            })
          }
          if (e.key === "users") {
            history.push({
              pathname: '/setup/users',
              activeKey: 'users'
            })
          }
          if (e.key === "receipts") {
            history.push({
              pathname: '/setup/receipts-templates',
              activeKey: 'receipts-templates'
            })
          }
        }
      }}
    >
      {readFromLocalStorage && (
        <React.Fragment>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
        </React.Fragment>
      )}

      {readFromLocalStorage && authenticateDashboard && (
        <React.Fragment>
          <Menu.Item key="categories" icon={<TagsOutlined />}>
            Categories
          </Menu.Item>
          <Menu.Item key="suppliers" icon={<SendOutlined />}>
            Suppliers
          </Menu.Item>
          <Menu.Item key="taxes" icon={<BankOutlined />}>
            Taxes
          </Menu.Item>
          <Menu.Item key="products" icon={<ShopOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="customers" icon={<UserOutlined />}>
            Customers
          </Menu.Item>
          <Menu.Item key="couriers" icon={<BarcodeOutlined />}>
            Couriers
          </Menu.Item>
          <SubMenu key="sub1" icon={<LaptopOutlined />} title="Register">
            <Menu.Item key="sell">Sell</Menu.Item>
            <Menu.Item key="salesHistory">Sales History</Menu.Item>
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
          <SubMenu key="reports" icon={<BarChartOutlined />} title="Reports">
            <Menu.Item key="salesSummary">Sales Summary</Menu.Item>
            <Menu.Item key="inventoryDump">Inventory Dump</Menu.Item>
            <Menu.Item key="productHistory">Product History</Menu.Item>
            <Menu.Item key="omniSalesSummary">Omni Sales Summary</Menu.Item>
            <Menu.Item key="categoryWise">Category Wise</Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<SettingOutlined />} title="Setup">
            <Menu.Item key="outlets">Outlets</Menu.Item>
            <Menu.Item key="users">Users</Menu.Item>
            <Menu.Item key="receipts">Receipt Templates</Menu.Item>
          </SubMenu>
        </React.Fragment>
      )}

      {readFromLocalStorage == null && (
        <React.Fragment>
          <Menu.Item key="signup" icon={<SendOutlined />}>
            Sign Up
          </Menu.Item>
          <Menu.Item key="signin" icon={<BankOutlined />}>
            Sign In
          </Menu.Item>
        </React.Fragment>
      )}
    </Menu>
  );
};

export default SideMenu;
