import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { message } from "antd";
import { useHistory } from "react-router-dom";

// Components
import AppShell from "./components/pages/appShell";
import Dashboard from "./components/pages/dashboard";
import Categories from "./components/pages/categories";
import CategoryAdd from "./components/pages/categories/categoryAdd";
import Suppliers from "./components/pages/suppliers";
import SupplierAdd from "./components/pages/suppliers/supplierAdd";
import SupplierEdit from "./components/pages/suppliers/editSupplier";
import SupplierDelete from "./components/pages/suppliers/deleteSupplier";
import Taxes from "./components/pages/taxes";
import TaxAdd from "./components/pages/taxes/taxAdd";
import TaxEdit from "./components/pages/taxes/editTax";
import TaxDelete from "./components/pages/taxes/deleteTax";
import Products from "./components/pages/products";
import ProductEdit from "./components/pages/products/editProduct";
import ProductDelete from "./components/pages/products/deleteProduct";
import ProductAdd from "./components/pages/products/productAdd";
import ProductDiscount from "./components/pages/products/productDiscount";
import ProductLookup from "./components/pages/products/productLookup";
import ProductUpload from "./components/pages/products/productUpload";
import Customers from "./components/pages/customers";
import CustomerForm from "./components/pages/customers/customerForm";
import CustomerProfile from "./components/pages/customers/customerProfile";
import CustomerPay from "./components/pages/customers/customerPay";
import CustomerCreditHistory from "./components/pages/customers/customerCreditHistory";
import CustomerDelete from "./components/pages/customers/deleteCustomer";
import Couriers from "./components/pages/couriers";
import CourierAdd from "./components/pages/couriers/courierAdd";
import CourierEdit from "./components/pages/couriers/editCourier";
import CourierDelete from "./components/pages/couriers/deleteCourier";
import SignUp from "./components/pages/signUp";
import SignIn from "./components/pages/signIn";
import Outlet from "./components/pages/outlet";
import EditCategory from "./components/pages/categories/editCategory";
import DeleteCategory from "./components/pages/categories/deleteCategory";
import {
  getDataFromLocalStorage,
  checkUserAuthFromLocalStorage,
  checkAuthTokenExpiration,
} from "./utils/local-storage/local-store-utils";
import Constants from "./utils/constants/constants";
import CategoryWise from "./components/pages/reports/categoryWise";
import InventoryDump from "./components/pages/reports/inventoryDump";
import OmniSalesSummary from "./components/pages/reports/omniSalesSummary";
import ProductHistory from "./components/pages/reports/productHistory";
import SalesSummary from "./components/pages/reports/salesSummary";
import Setup from "./components/pages/setup";
import OutletEdit from "./components/pages/setup/outlets/outletEdit";
import OutletAdd from "./components/pages/setup/outlets/outletAdd";
import UserAdd from "./components/pages/setup/users/userAdd";
import UserEdit from "./components/pages/setup/users/editUser";
import ReceiptAdd from "./components/pages/setup/receipt/receiptAdd";
import ReceiptEdit from "./components/pages/setup/receipt/receiptEdit";
import ReceiptDelete from "./components/pages/setup/receipt/receiptDelete";
import SalesHistory from "./components/pages/register/salesHistory";
import Sell from "./components/pages/register/sell";
import ViewInvoice from "./components/pages/register/invoice/viewInvoice";
import Stock from "./components/pages/stock";
import PurchaseOrder from "./components/pages/stock/order";
import ReceiveStock from "./components/pages/stock/stockReceive";
import ViewStockReturn from "./components/pages/stock/ReturnedStock/viewStockReturn";
import ReceiveStockTransfer from "./components/pages/stock/stockReceive/transfer";
import StockAdjustment from "./components/pages/stock/order/adjustmentStock";
import ReturnStock from "./components/pages/stock/order/returnStock";
import TransferOut from "./components/pages/stock/order/transferInventory";
import EcommerceOrders from "./components/pages/ecommerce/orders";
import InventorySync from "./components/pages/ecommerce/inventorySync";
import OeSaleOrderInvoiceView from "./components/pages/ecommerce/orders/omniSalesOrders/viewOmniSaleOrder";
import SaStock from "./components/pages/superAdmin/index";





const Routes = () => {
  const history = useHistory();

  const renderWithLayout = (Component, props, attrs = {}) => {
    return (
      <AppShell {...props}>
        {attrs.isOutletLayout ? (
          <Outlet />
        ) : (
          <Component {...props} {...attrs} />
        )}
      </AppShell>
    );
  };

  const RenderWithLayoutOutlet = (Component, props) => {
    var readFromLocalStorage = getDataFromLocalStorage("user");
    var authExpirationTokenDate;

    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    var authenticateDashboard = false;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        authenticateDashboard = true;
        authExpirationTokenDate = readFromLocalStorage.auth.expire_at;
      } else {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage.expire_at;
      }
    }

    if (checkAuthTokenExpiration(authExpirationTokenDate)) {
      message.info("Logging Out Redirecting....", 5);
      return <Redirect to="/sign-in" />;
    }

    return (
      <AppShell {...props}>
        {readFromLocalStorage == null ? (
          <Redirect to="/sign-in" />
        ) : authenticateDashboard ? (
          <Component />
        ) : (
          <Component />
        )}
      </AppShell>
    );
  };

  const authRenderWithLayout = (Component, props) => {
    //console.log("props-in-sigin", props);
    var readFromLocalStorage = getDataFromLocalStorage("user");
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    var authenticateDashboard = false;
    if (readFromLocalStorage) {
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        authenticateDashboard = true;
      } else {
        authenticateDashboard = false;
      }
    }

    return (
      <AppShell {...props}>
        {readFromLocalStorage == null ? (
          <Component />
        ) : authenticateDashboard ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/outlets" />
        )}
      </AppShell>
    );
  };

  const PrivateRoute = ({ component: Component, ...rest }) => {
    //console.log(rest.path.split('/'));
    var readFromLocalStorage = getDataFromLocalStorage("user");
    var authExpirationTokenDate;
    let routePathName = rest.path.split("/")[1]; //imp to split path
    if(routePathName === "stock-control"){routePathName = "stock_control"}   //imp new one
    var userRouteScopes = [];
    var adminUser = false;

    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    var authenticateDashboard = false;
    if (readFromLocalStorage) {
      userRouteScopes = readFromLocalStorage.scopes || [];
      if (
        checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
      ) {
        authenticateDashboard = true;
        authExpirationTokenDate = readFromLocalStorage.auth.expire_at;
      } else {
        authenticateDashboard = false;
        authExpirationTokenDate = readFromLocalStorage.expire_at;
      }
    }

    if (checkAuthTokenExpiration(authExpirationTokenDate)) {
      message.info("Logging Out Redirecting....", 3);
      return <Redirect to="/sign-in" />;
    } else {
      if (userRouteScopes.includes("*")) {
        adminUser = true;
      }
      if (adminUser === false) {
        if (
          !userRouteScopes.includes(routePathName) &&
          routePathName !== "dashboard"
        ) {
          message.warning("You are not authorized to view this page", 3);
          return <Redirect to="/dashboard" />;
        }
      }
    }

    return (
      <Route
        {...rest}
        render={(props) =>
          readFromLocalStorage ? (
            authenticateDashboard ? (
              renderWithLayout(Component, { ...props })
            ) : (
              <Redirect to="/outlets" />
            )
          ) : (
            <Redirect to="/sign-in" />
          )
        }
      />
    );
  };

  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Route
          exact
          path="/"
          render={() => (
              <Redirect to="/dashboard"/>
          )}
        ></Route>
        <PrivateRoute exact path="/categories" component={Categories} />
        <PrivateRoute exact path="/suppliers" component={Suppliers} />
        <PrivateRoute
          exact
          path="/suppliers/:supplier_id/edit"
          component={(props) => <SupplierEdit {...props} />}
        />
        <PrivateRoute
          exact
          path="/suppliers/:supplier_id/delete"
          component={(props) => <SupplierDelete {...props} />}
        />
        <PrivateRoute exact path="/suppliers/add" component={SupplierAdd} />
        <PrivateRoute exact path="/taxes" component={Taxes} />
        <PrivateRoute exact path="/taxes/add" component={TaxAdd} />
        <PrivateRoute
          exact
          path="/taxes/:tax_id/edit"
          component={(props) => <TaxEdit {...props} />}
        />
        <PrivateRoute
          exact
          path="/taxes/:tax_id/delete"
          component={(props) => <TaxDelete {...props} />}
        />
        <PrivateRoute exact path="/products" component={Products} />
        <PrivateRoute exact path="/products/add" component={ProductAdd} />
        <PrivateRoute exact path="/products/upload" component={ProductUpload} />
        <PrivateRoute exact path="/products/lookup" component={ProductLookup} />
        <PrivateRoute
          exact
          path="/products/:product_id/edit"
          //component={ProductEdit}
          component={(props) => <ProductEdit {...props} />}
        />
        <PrivateRoute
          exact
          path="/products/:product_id/delete"
          //component={ProductDelete}
          component={(props) => <ProductDelete {...props} />}
        />
        <PrivateRoute
          exact
          path="/products/discount"
          component={ProductDiscount}
        />
        <PrivateRoute exact path="/customers" component={Customers} />
        <PrivateRoute
          exact
          path="/customers/add"
          component={(props) => <CustomerForm {...props} />}
        />
        <PrivateRoute
          exact
          path="/customers/:customer_id/view"
          component={(props) => <CustomerProfile {...props} />}
        />
        <PrivateRoute
          exact
          path="/customers/:customer_id/edit"
          component={(props) => (
            <CustomerForm {...props} isCustomerEditMode={true} />
          )}
        />
        <PrivateRoute
          exact
          path="/customers/:customer_id/delete"
          component={(props) => <CustomerDelete {...props} />}
        />
        <PrivateRoute
          exact
          path="/customers/profile"
          component={(props) => <CustomerProfile {...props} />}
        />
        <PrivateRoute
          exact
          path="/customers/:customer_id/pay-account-balance"
          component={(props) => <CustomerPay {...props} />}
        />
        <PrivateRoute
          exact
          path="/customers/:customer_id/credit-history"
          component={(props) => <CustomerCreditHistory {...props} />}
        />
        <Route
          exact
          path="/signup"
          render={() => authRenderWithLayout(SignUp)}
        ></Route>
        <Route
          exact
          path="/sign-in"
          render={() => authRenderWithLayout(SignIn)}
        ></Route>
        <Route
          exact
          path="/outlets"
          render={() => RenderWithLayoutOutlet(Outlet)}
        ></Route>
        <PrivateRoute exact path="/categories/add" component={CategoryAdd} />
        <PrivateRoute
          exact
          path="/categories/:cat_id/edit"
          component={(props) => <EditCategory {...props} />}
        />
        <PrivateRoute
          exact
          path="/categories/:cat_id/delete"
          component={(props) => <DeleteCategory {...props} />}
        />
        <PrivateRoute exact path="/couriers" component={Couriers} />
        <PrivateRoute exact path="/couriers/add" component={CourierAdd} />
        <PrivateRoute
          exact
          path="/couriers/:courier_id/edit"
          component={(props) => <CourierEdit {...props} />}
        />
        <PrivateRoute
          exact
          path="/couriers/:courier_id/delete"
          component={(props) => <CourierDelete {...props} />}
        />
        <PrivateRoute
          exact
          path="/reports/categoryWise"
          component={CategoryWise}
        />
        <PrivateRoute
          exact
          path="/reports/inventoryDump"
          component={InventoryDump}
        />
        <PrivateRoute
          exact
          path="/reports/omniSalesSummary"
          component={OmniSalesSummary}
        />

        <PrivateRoute
          exact
          path="/reports/productHistory"
          component={ProductHistory}
        />
        <PrivateRoute
          exact
          path="/reports/salesSummary"
          component={SalesSummary}
        />

        <PrivateRoute
          exact
          path="/stock-control/purchase-orders"
          component={() => <Stock  activeKey={'purchase-orders'} />}
        />
        <PrivateRoute
          exact
          path="/stock-control/inventory-transfers"
          component={() => <Stock  activeKey={'inventory-transfers'} />}
        />
        <PrivateRoute
          exact
          path="/stock-control/stock-adjustments"
          component={() => <Stock  activeKey={'stock-adjustments'} />}
        />
        <PrivateRoute
          exact
          path="/stock-control/returned-stock"
          component={() => <Stock  activeKey={'returned-stock'} />}
        />
        <PrivateRoute
          exact
          path="/stock-control/returned-stock/:stock_return_id/view"
          component={(props) => <ViewStockReturn {...props} />}
        />
        <PrivateRoute
          exact
          path="/stock-control/purchase-orders/add"
          component={PurchaseOrder}
        />
        <PrivateRoute
          exact
          path="/stock-control/stock-adjustments/add"
          component={StockAdjustment}
        />
        <PrivateRoute
          exact
          path="/stock-control/return-stock/add"
          component={ReturnStock}
        />
        <PrivateRoute
          exact
          path="/stock-control/inventory-transfers/add"
          component={TransferOut}
        />
        <PrivateRoute
          exact
          path="/stock-control/purchase-orders/:po_id/receive"
          component={(props) => <ReceiveStock {...props} />}
        />
        <PrivateRoute
          exact
          path="/stock-control/inventory-transfers/:transfer_id/receive"
          component={(props) => <ReceiveStockTransfer {...props} />}
        />
        {/*<PrivateRoute
          exact
          path="/super-admin/stock-control/purchase-orders"
          component={() => <SaStock  activeKey={'purchase-orders'} />}
        />
        <PrivateRoute
          exact
          path="/super-admin/stock-control/inventory-transfers"
          component={() => <SaStock  activeKey={'inventory-transfers'} />}
        /> */}
        <PrivateRoute
          exact
          path="/setup/users"
          component={() => <Setup activeKey={"users"} />}
        />
        <PrivateRoute
          exact
          path="/setup/outlets"
          component={() => <Setup activeKey={'outlets'} />}
        />
        <PrivateRoute
          exact
          path="/setup/receipts-templates"
          component={() => <Setup  activeKey={'receipts-templates'} />}
        />
        <PrivateRoute exact path="/setup/outlets/add" component={OutletAdd} />
        <PrivateRoute
          exact
          path="/setup/outlets/:outlet_id/edit"
          component={(props) => <OutletEdit {...props} />}
        />
        <PrivateRoute exact path="/setup/users/add" component={UserAdd} />
        <PrivateRoute
          exact
          path="/setup/users/:user_id/edit"
          component={(props) => <UserEdit {...props} />}
        />
        <PrivateRoute
          exact
          path="/setup/receipts-templates/add"
          component={ReceiptAdd}
        />
        <PrivateRoute
          exact
          path="/setup/receipts-templates/:template_id/edit"
          component={(props) => <ReceiptEdit {...props} />}
        />
        <PrivateRoute
          exact
          path="/setup/receipts-templates/:template_id/delete"
          component={(props) => <ReceiptDelete {...props} />}
        />
        <PrivateRoute exact path="/register/sell" component={Sell} />
        <PrivateRoute
          exact
          path="/register/salesHistory"
          component={SalesHistory}
        />
        <PrivateRoute
          exact
          path="/register/invoice/:invoice_id/view"
          component={(props) => <ViewInvoice {...props} />}
        />
        <PrivateRoute
          exact
          path="/ecommerce/orders"
          component={EcommerceOrders}
        />
        <PrivateRoute
          exact
          path="/ecommerce/orders/:invoice_id/view"
          component={(props) => <OeSaleOrderInvoiceView {...props} />}
        />
        <PrivateRoute
          exact
          path="/ecommerce/inventory-sync"
          component={InventorySync}
        />
        <Route
          render={() => (
              <Redirect to="/dashboard"/>
          )}
        ></Route>
      </Switch>
    </div>
  );
};

export default Routes;
