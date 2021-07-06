import React, { useState, useEffect } from "react";
import "./style.scss";
import { useHistory, Link } from "react-router-dom";

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
  const [openKeys, setOpenKeys] = useState([]);

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
    stock: "stock_control",
    ecommerce: "ecommerce",
  };
  var adminUser = false;
  var storeEcommerce = false;


  var readFromLocalStorage = getDataFromLocalStorage("user");
  readFromLocalStorage = readFromLocalStorage.data
    ? readFromLocalStorage.data
    : null;
  var authenticateDashboard = false;
  if (readFromLocalStorage) {
    userRouteScopes = readFromLocalStorage.scopes || [];
    //console.log(checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication);
    if (
      checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
    ) {
      authenticateDashboard = true;
      if (readFromLocalStorage.auth.store_ecommerce && readFromLocalStorage.auth.store_ecommerce === "true") {
        storeEcommerce = true;
      }
    } else {
      authenticateDashboard = false;
    }
  }


  if (userRouteScopes.includes("*")) {
    adminUser = true;
  }


  const { SubMenu } = Menu;
  // submenu keys of first level
  const rootSubmenuKeys = ['register', 'stock', 'setup', 'reports', 'ecommerce'];

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };


  const stockScopeFilter = (localUserInfo) => {
    if(!localUserInfo){return;}
    if(localUserInfo.user_role == 'cashier' || localUserInfo.user_role == 'shop_manager'){
       return false;
    }
    else{
      return true;
    }

  };


  /*const onNavMenuItemClick = (currentMenuItem) => {

    //console.log(currentMenuItem);
    if (currentMenuItem === "dashboard") {
      if (readFromLocalStorage && authenticateDashboard) {
        history.push("/dashboard");
      } else {
        history.push("/outlets");
      }
    } else if (currentMenuItem === "salesSummary") {
      history.push("/reports/salesSummary");
    } else if (currentMenuItem === "inventoryDump") {
      history.push("/reports/inventoryDump");
    } else if (currentMenuItem === "productHistory") {
      history.push("/reports/productHistory");
    } else if (currentMenuItem === "omniSalesSummary") {
      history.push("/reports/omniSalesSummary");
    } else if (currentMenuItem === "categoryWise") {
      history.push("/reports/categoryWise");
    } else if (currentMenuItem === "salesHistory") {
      history.push("/register/salesHistory");
    } else if (currentMenuItem === "sell") {
      history.push("/register/sell");
    } else if (currentMenuItem === "outlets" || currentMenuItem === "users" || currentMenuItem === "receipts") {
      if (currentMenuItem === "outlets") {
        history.push({
          pathname: '/setup/outlets',
          activeKey: 'outlets'
        })
      }
      if (currentMenuItem === "users") {
        history.push({
          pathname: '/setup/users',
          activeKey: 'users'
        })
      }
      if (currentMenuItem === "receipts") {
        history.push({
          pathname: '/setup/receipts-templates',
          activeKey: 'receipts-templates'
        })
      }
    } else if (currentMenuItem === "purchaseOrders" || currentMenuItem === "inventoryTransfers" || currentMenuItem === "stockAdjustments") {
      if (currentMenuItem === "purchaseOrders") {
        history.push({
          pathname: '/stock-control/purchase-orders',
          activeKey: 'purchase-orders'
        })
      }
      if (currentMenuItem === "inventoryTransfers") {
        history.push({
          pathname: '/stock-control/inventory-transfers',
          activeKey: 'inventory-transfers'
        })
      }
      if (currentMenuItem === "stockAdjustments") {
        history.push({
          pathname: '/stock-control/stock-adjustments',
          activeKey: 'stock-adjustments'
        })
      }
    }
    else if (currentMenuItem === "saleOrders" || currentMenuItem === "InventorySync") {
      if (currentMenuItem === "saleOrders") {
        history.push({
          pathname: '/ecommerce/orders',
        })
      }
      if (currentMenuItem === "InventorySync") {
        history.push({
          pathname: '/ecommerce/inventory-sync',
        })
      }
    }
    else {
      history.push({
        pathname: `${currentMenuItem}`,
      })

    }


  };*/






  return (
    <Menu
      theme="dark"
      mode="inline"
      className="side-menu side-menu-padding"
      defaultSelectedKeys={["dashboard"]}
      openKeys={openKeys}
      onOpenChange={onOpenChange}

    >

      {readFromLocalStorage && (
        <React.Fragment>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to={(readFromLocalStorage && authenticateDashboard) ? "/dashboard" : "/outlets"}
              className="nav-menu-item-link" >Dashboard</Link>
          </Menu.Item>
        </React.Fragment>
      )}
      

      {readFromLocalStorage && authenticateDashboard && (
        <React.Fragment>
          {(userRouteScopes.includes(appRouteScopes.categories) || adminUser) &&
            <Menu.Item key="categories" icon={<TagsOutlined />}>
              <Link to="/categories" className="nav-menu-item-link"  >Categories</Link>
            </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.suppliers) || adminUser) &&
            <Menu.Item key="suppliers" icon={<SendOutlined />}>
              <Link to="/suppliers" className="nav-menu-item-link"  >Suppliers</Link>
            </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.taxes) || adminUser) &&
            <Menu.Item key="taxes" icon={<BankOutlined />}>
              <Link to="/taxes" className="nav-menu-item-link"  >Taxes</Link>
            </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.products) || adminUser) &&
            <Menu.Item key="products" icon={<ShopOutlined />}>
              <Link to="/products" className="nav-menu-item-link"  >Products</Link>
            </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.customers) || adminUser) &&
            <Menu.Item key="customers" icon={<UserOutlined />}>
              <Link to="/customers" className="nav-menu-item-link"  >Customers</Link>
            </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.couriers) || adminUser) &&
            <Menu.Item key="couriers" icon={<BarcodeOutlined />}>
              <Link to="/couriers" className="nav-menu-item-link"  >Couriers</Link>
            </Menu.Item>}
          {(userRouteScopes.includes(appRouteScopes.register) || adminUser) &&
            <SubMenu key="register" icon={<LaptopOutlined />} title="Register">
              <Menu.Item key="sell">
                <Link to="/register/sell" className="nav-menu-item-link"  >Sell</Link>
              </Menu.Item>
              <Menu.Item key="salesHistory">
                <Link to="/register/salesHistory" className="nav-menu-item-link"  >Sales History</Link>
              </Menu.Item>
            </SubMenu>}
          {(userRouteScopes.includes(appRouteScopes.stock) || adminUser) &&
            <SubMenu key="stock" icon={<StockOutlined />} title="Stock Control">

            {stockScopeFilter(readFromLocalStorage.user_info || null) &&
              <Menu.Item key="purchaseOrders">
                <Link to="/stock-control/purchase-orders" className="nav-menu-item-link"  >Purchase Orders</Link>
              </Menu.Item>}

              <Menu.Item key="inventoryTransfers">
                <Link to="/stock-control/inventory-transfers" className="nav-menu-item-link"  >Inventory Transfers</Link>
              </Menu.Item>

            {stockScopeFilter(readFromLocalStorage.user_info || null) &&
              <Menu.Item key="stockAdjustments">
                <Link to="/stock-control/stock-adjustments" className="nav-menu-item-link"  >Stock Adjustment</Link>
              </Menu.Item>}

            {stockScopeFilter(readFromLocalStorage.user_info || null) &&
              <Menu.Item key="stockReturned">
                <Link to="/stock-control/returned-stock" className="nav-menu-item-link"  >Returned Stock</Link>
              </Menu.Item>}

            </SubMenu>}
          {((userRouteScopes.includes(appRouteScopes.ecommerce) || adminUser) && storeEcommerce) &&
            <SubMenu key="ecommerce" icon={<ApartmentOutlined />} title="Ecommerce">
              <Menu.Item key="saleOrders">
                <Link to="/ecommerce/orders" className="nav-menu-item-link"  >Orders</Link>
              </Menu.Item>
              <Menu.Item key="InventorySync">
                <Link to="/ecommerce/inventory-sync" className="nav-menu-item-link"  >Inventory Sync</Link>
              </Menu.Item>
            </SubMenu>}
          {(userRouteScopes.includes(appRouteScopes.reports) || adminUser) &&
            <SubMenu key="reports" icon={<BarChartOutlined />} title="Reports">
              <Menu.Item key="salesSummary">
                <Link to="/reports/salesSummary" className="nav-menu-item-link"  >Sales Summary</Link>
              </Menu.Item>
              <Menu.Item key="inventoryDump">
                <Link to="/reports/inventoryDump" className="nav-menu-item-link" >Inventory Dump</Link>
              </Menu.Item>
              <Menu.Item key="productHistory">
                <Link to="/reports/productHistory" className="nav-menu-item-link" >Product History</Link>
              </Menu.Item>
              <Menu.Item key="omniSalesSummary">
                <Link to="/reports/omniSalesSummary" className="nav-menu-item-link"  >Omni Sales Summary</Link>
              </Menu.Item>
              <Menu.Item key="categoryWise">
                <Link to="/reports/categoryWise" className="nav-menu-item-link"  >Category Wise</Link>
              </Menu.Item>
            </SubMenu>}
          {(userRouteScopes.includes(appRouteScopes.setup) || adminUser) &&
            <SubMenu key="setup" icon={<SettingOutlined />} title="Setup">
              <Menu.Item key="outlets">
                <Link to="/setup/outlets" className="nav-menu-item-link" >Outlets</Link>
              </Menu.Item>
              <Menu.Item key="users">
                <Link to="/setup/users" className="nav-menu-item-link"  >Users</Link>
              </Menu.Item>
              <Menu.Item key="receipts">
                <Link to="/setup/receipts-templates" className="nav-menu-item-link" > Receipt Templates</Link>
              </Menu.Item>
            </SubMenu>}

          {(adminUser) &&
            <SubMenu key="superAdmin" icon={<SettingOutlined />} title="Super Admin">
              <Menu.Item key="SuperAdminPurchaseOrders">
                <Link to="/super-admin/stock-control/purchase-orders" className="nav-menu-item-link" >Purchase Orders</Link>
              </Menu.Item>
              <Menu.Item key="superAdminInventoryTransfers">
                <Link to="/super-admin/stock-control/inventory-transfers" className="nav-menu-item-link"  >Inventory Transfers</Link>
              </Menu.Item>
            </SubMenu>}
        </React.Fragment>
      )}

      {readFromLocalStorage == null && (
        <React.Fragment>
          <Menu.Item key="signup" icon={<SendOutlined />}>
            <Link to="/signup" className="nav-menu-item-link" >Sign Up</Link>
          </Menu.Item>
          <Menu.Item key="signin" icon={<BankOutlined />}>
            <Link  to="/sign-in" className="nav-menu-item-link"  >Sign In</Link>
          </Menu.Item>
        </React.Fragment>
      )}
    </Menu>
  );
};

export default SideMenu;