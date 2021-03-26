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

  var userRouteScopes = [];
  const appRouteScopes =
  {
    categories: "categories",
    couriers: "couriers",
    taxes: "taxes",
    suppliers: "suppliers",
    products: "products",
    customers: "customers",
    register: "register",
    reports: "reports",
    setup: "setup",
    stock: "stock-control",
  };
  var adminUser = false;


  var readFromLocalStorage = getDataFromLocalStorage("user");
  readFromLocalStorage = readFromLocalStorage.data
    ? readFromLocalStorage.data
    : null;
  var authenticateDashboard = false;
  if (readFromLocalStorage) {
    userRouteScopes = readFromLocalStorage.scopes || [];
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


  if(userRouteScopes.includes("*")){
    adminUser = true;
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
          history.push("/reports/salesSummary");
        } else if (e.key === "inventoryDump") {
          history.push("/reports/inventoryDump");
        } else if (e.key === "productHistory") {
          history.push("/reports/productHistory");
        } else if (e.key === "omniSalesSummary") {
          history.push("/reports/omniSalesSummary");
        } else if (e.key === "categoryWise") {
          history.push("/reports/categoryWise");
        } else if (e.key === "salesHistory") {
          history.push("/register/salesHistory");
        } else if (e.key === "sell") {
          history.push("/register/sell");
        } else if (e.key === "signup") {
          history.push("/signup");
        } else if (e.key === "signin") {
          history.push("/sign-in");
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
        } else if (e.key === "purchaseOrders" || e.key === "inventoryTransfers" || e.key === "stockAdjustments") {
          if (e.key === "purchaseOrders") {
            history.push({
              pathname: '/stock-control/purchase-orders',
              activeKey: 'purchase-orders'
            })
          }
          if (e.key === "inventoryTransfers") {
            history.push({
              pathname: '/stock-control/inventory-transfers',
              activeKey: 'inventory-transfers'
            })
          }
          if (e.key === "stockAdjustments") {
            history.push({
              pathname: '/stock-control/stock-adjustments',
              activeKey: 'stock-adjustments'
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
          {(userRouteScopes.includes(appRouteScopes.categories) || adminUser) &&
          <Menu.Item key="categories" icon={<TagsOutlined />}>
            Categories
          </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.suppliers) || adminUser) &&
          <Menu.Item key="suppliers" icon={<SendOutlined />}>
            Suppliers
          </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.taxes) || adminUser) &&
          <Menu.Item key="taxes" icon={<BankOutlined />}>
            Taxes
          </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.products) || adminUser) &&
          <Menu.Item key="products" icon={<ShopOutlined />}>
            Products
          </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.customers) || adminUser) &&
          <Menu.Item key="customers" icon={<UserOutlined />}>
            Customers
          </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.couriers) || adminUser) &&
          <Menu.Item key="couriers" icon={<BarcodeOutlined />}>
            Couriers
          </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.register) || adminUser) &&
          <SubMenu key="sub1" icon={<LaptopOutlined />} title="Register">
            <Menu.Item key="sell">Sell</Menu.Item>
            <Menu.Item key="salesHistory">Sales History</Menu.Item>
          </SubMenu>}
          {(userRouteScopes.includes(appRouteScopes.stock) || adminUser) &&
          <SubMenu key="sub2" icon={<StockOutlined />} title="Stock Control">
            <Menu.Item key="purchaseOrders">Purchase Orders</Menu.Item>
            <Menu.Item key="inventoryTransfers">Inventory Transfers</Menu.Item>
            <Menu.Item key="stockAdjustments">Stock Adjustment</Menu.Item>
          </SubMenu>}
          <SubMenu key="sub3" icon={<ApartmentOutlined />} title="Ecommerce">
            <Menu.Item key="13">Orders</Menu.Item>
            <Menu.Item key="14">Inventory Sync</Menu.Item>
          </SubMenu>
          {(userRouteScopes.includes(appRouteScopes.reports) || adminUser) &&
          <SubMenu key="reports" icon={<BarChartOutlined />} title="Reports">
            <Menu.Item key="salesSummary">Sales Summary</Menu.Item>
            <Menu.Item key="inventoryDump">Inventory Dump</Menu.Item>
            <Menu.Item key="productHistory">Product History</Menu.Item>
            <Menu.Item key="omniSalesSummary">Omni Sales Summary</Menu.Item>
            <Menu.Item key="categoryWise">Category Wise</Menu.Item>
          </SubMenu>}
          {(userRouteScopes.includes(appRouteScopes.setup) || adminUser) &&
          <SubMenu key="sub5" icon={<SettingOutlined />} title="Setup">
            <Menu.Item key="outlets">Outlets</Menu.Item>
            <Menu.Item key="users">Users</Menu.Item>
            <Menu.Item key="receipts">Receipt Templates</Menu.Item>
          </SubMenu>}
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
