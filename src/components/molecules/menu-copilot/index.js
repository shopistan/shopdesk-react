import React, { useState } from "react";
import { Link  } from 'react-router-dom';
import { Navigation } from "@teamfabric/copilot-ui/dist/molecules";
import "./style.scss";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
} from "../../../utils/local-storage/local-store-utils";
import Constants from "../../../utils/constants/constants";



function Side_Nav_Copilot() {
  const [activeMenuItemId, setActiveMenuItemId] = useState("");


  let userRouteScopes = [];
  const appRouteScopes = {
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


  let adminUser = false;
  let storeEcommerce = false;


  let readFromLocalStorage = getDataFromLocalStorage("user");
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
      if (
        readFromLocalStorage.auth.store_ecommerce &&
        readFromLocalStorage.auth.store_ecommerce === "true"
      ) {
        storeEcommerce = true;
      }
    } else {
      authenticateDashboard = false;
    }
  }

  if (userRouteScopes.includes("*")) {
    adminUser = true;
  }

  //const { SubMenu } = Menu;
  // submenu keys of first level
  const rootSubmenuKeys = [
    "register",
    "stock",
    "setup",
    "reports",
    "ecommerce",
  ];

  const stockScopeFilter = (localUserInfo) => {
    if (!localUserInfo) {
      return;
    }
    if (
      localUserInfo.user_role == "cashier" ||
      localUserInfo.user_role == "shop_manager"
    ) {
      return false;
    } else {
      return true;
    }
  };

  /*---------------------------new vwersion-------------------------------------*/

  const menuItemClick = (event, label, id) => {
    //console.log("label", label);   //gives complete data
    setActiveMenuItemId(label ? label.id : "");
  };


  const menuItemActiveStatus = (id) => {
    //console.log("current-id", id); 
    return id === activeMenuItemId ? true : false;
  };


  let allNavigationLinksArr = [];
  let navLinkNode = {};


  if (readFromLocalStorage) {
    navLinkNode = {
      id: 1,
      label: <Link to={(readFromLocalStorage && authenticateDashboard) ? "/dashboard" : "/outlets"}>Dashboard</Link>,
      active: menuItemActiveStatus(1),
      
    }
    allNavigationLinksArr.push(navLinkNode);
  }
  if (readFromLocalStorage && authenticateDashboard) {

    if (userRouteScopes.includes(appRouteScopes.categories) || adminUser) {
      navLinkNode = {
        id: 2,
        label: <Link to="/categories">Categories</Link>,
        active: menuItemActiveStatus(2),
        //url: "/",
      }

      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.suppliers) || adminUser) {
      navLinkNode = {
        id: 4,
        label: <Link to="/suppliers">Suppliers</Link>,
        active: menuItemActiveStatus(4),
      }

      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.taxes) || adminUser) {
      navLinkNode = {
        id: 5,
        label: <Link to="/taxes">Taxes</Link>,
        active: menuItemActiveStatus(5),
        
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.products) || adminUser) {
      navLinkNode = {
        id: 6,
        label: <Link to="/products">Products</Link>,
        active: menuItemActiveStatus(6),
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.customers) || adminUser) {
      navLinkNode = {
        id: 7,
        label: <Link to="/customers">Customers</Link>,
        active: menuItemActiveStatus(7),
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.couriers) || adminUser) {
      navLinkNode = {
        id: 8,
        label: <Link to="/couriers">Couriers</Link>,
        active: menuItemActiveStatus(8),
      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.register) || adminUser) {  
      navLinkNode = {
        id: 9,
        label: "Register",
        children: [
          {
            id: 10,
            label: <Link to="/register/sell">Sell</Link>,
            active: menuItemActiveStatus(10),
          },
          {
            id: 11,
            label: <Link to="/register/salesHistory">Sales History</Link>,
            active: menuItemActiveStatus(11),
          },
        ],

      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.stock) || adminUser) {
      let nodeChildArr = [];
      nodeChildArr.push({
        id: 14,
        label: <Link to="/stock-control/inventory-transfers">Inventory Transfers</Link>,
        active: menuItemActiveStatus(14),
      });
      if(stockScopeFilter(readFromLocalStorage.user_info || null )){
        nodeChildArr.push({
          id: 13,
          label: <Link to="/stock-control/purchase-orders">Purchase Orders</Link>,
          active: menuItemActiveStatus(13),
        });
        nodeChildArr.push({
          id: 15,
          label: <Link to="/stock-control/stock-adjustments">Stock Adjustment</Link>,
          active: menuItemActiveStatus(15),
        });
        nodeChildArr.push({
          id: 16,
          label: <Link to="/stock-control/returned-stock">Returned Stock</Link>,
          active: menuItemActiveStatus(16),
        });

      }
      
      navLinkNode = {
        id: 12,
        label: "Stock Control",
        children: nodeChildArr,
      }

      allNavigationLinksArr.push(navLinkNode);

    }
    if ((userRouteScopes.includes(appRouteScopes.ecommerce) || adminUser) && storeEcommerce)  {
      navLinkNode = {
        id: 17,
        label: "Ecommerce",
        children: [
          {
            id: 18,
            label: <Link to="/ecommerce/orders">Orders</Link>,
            active: menuItemActiveStatus(18),
          },
          {
            id: 19,
            label: <Link to="/ecommerce/inventory-sync">Inventory Sync</Link>,
            active: menuItemActiveStatus(19),
          },
        ],

      }
      allNavigationLinksArr.push(navLinkNode);

    }
    if (userRouteScopes.includes(appRouteScopes.reports) || adminUser) {
      navLinkNode = {
        id: 20,
        label: "Reports",
        children: [
          {
            id: 21,
            label: <Link to="/reports/salesSummary">Sales Summary</Link>,
            active: menuItemActiveStatus(21),
          },
          {
            id: 22,
            label: <Link to="/reports/inventoryDump">Inventory Dump</Link>,
            active: menuItemActiveStatus(22),
          },
          {
            id: 23,
            label: <Link to="/reports/productHistory">Product History</Link>,
            active: menuItemActiveStatus(23),
          },
          {
            id: 24,
            label: <Link to="/reports/omniSalesSummary">Omni Sales Summary</Link>,
            active: menuItemActiveStatus(24),
          },
          {
            id: 25,
            label: <Link to="/reports/categoryWise">Category Wise</Link>,
            active: menuItemActiveStatus(25),
          },
        ],

      }
      allNavigationLinksArr.push(navLinkNode);

    }

    if (userRouteScopes.includes(appRouteScopes.setup) || adminUser) {
      navLinkNode = {
        id: 26,
        label: "Setup",
        children: [
          {
            id: 27,
            label: <Link to="/setup/outlets">Outlets</Link>,
            active: menuItemActiveStatus(27),
          },
          {
            id: 28,
            label: <Link to="/setup/users">Users</Link>,
            active: menuItemActiveStatus(28),
          },
          {
            id: 29,
            label: <Link to="/setup/receipts-templates">Receipt Templates</Link>,
            active: menuItemActiveStatus(29),
          },
        ],

      }
      allNavigationLinksArr.push(navLinkNode);

    }


  }

  if (readFromLocalStorage == null) {
    navLinkNode = {
      id: 30,
      label: <Link to="/signup">Sign Up</Link>,
      active: menuItemActiveStatus(30),
    }
    allNavigationLinksArr.push(navLinkNode);

    navLinkNode = {
      id: 31,
      label: <Link to="/sign-in">Sign In</Link>,
      active: menuItemActiveStatus(31),
    }
    allNavigationLinksArr.push(navLinkNode);

  }

  /*---------------------------new vwersion-------------------------------------*/


  return (
    <div className="side_nav_copilot">
      <Navigation
        className="secondary"
        links={allNavigationLinksArr}
        onClick={menuItemClick}
        orientation="vertical"
      />
    </div>
  );
}

export default Side_Nav_Copilot;
