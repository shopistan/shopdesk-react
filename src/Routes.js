import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

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
} from "./utils/local-storage/local-store-utils";
import Constants from "./utils/constants/constants";
import CategoryWise from "./components/pages/reports/categoryWise";
import InventoryDump from "./components/pages/reports/inventoryDump";
import OmniSalesSummary from "./components/pages/reports/omniSalesSummary";
import ProductHistory from "./components/pages/reports/productHistory";
import SalesSummary from "./components/pages/reports/salesSummary";
import Setup from "./components/pages/setup";
import OutletAdd from "./components/pages/setup/outlets/outletAdd";
import UserAdd from "./components/pages/setup/users/userAdd";
import ReceiptAdd from "./components/pages/setup/receipt/receiptAdd";
import SalesHistory from "./components/pages/register/salesHistory";
import Sell from "./components/pages/register/sell";
import Stock from "./components/pages/stock";
import PurchaseOrder from "./components/pages/stock/order";

const Routes = () => {
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

  const authRenderWithLayout = (Component, props) => {
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
      <Route
        {...rest}
        render={(props) =>
          readFromLocalStorage ? (
            authenticateDashboard ? (
              renderWithLayout(Component, { ...props })
            ) : (
              renderWithLayout(
                Component,
                { ...props },
                { isOutletLayout: true }
              )
            )
          ) : (
            <Redirect to="/signin" />
          )
        }
      />
    );
  };

  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/categories" component={Categories} />
        <PrivateRoute exact path="/suppliers" component={Suppliers} />
        <PrivateRoute
          exact
          path="/suppliers/:id/edit"
          component={SupplierEdit}
        />
        <PrivateRoute
          exact
          path="/suppliers/:id/delete"
          component={SupplierDelete}
        />
        <PrivateRoute exact path="/suppliers/add" component={SupplierAdd} />
        <PrivateRoute exact path="/taxes" component={Taxes} />
        <PrivateRoute exact path="/taxes/add" component={TaxAdd} />
        <PrivateRoute exact path="/taxes/:id/edit" component={TaxEdit} />
        <PrivateRoute exact path="/taxes/:id/delete" component={TaxDelete} />
        <PrivateRoute exact path="/products" component={Products} />
        <PrivateRoute exact path="/products/add" component={ProductAdd} />
        <PrivateRoute exact path="/products/upload" component={ProductUpload} />
        <PrivateRoute exact path="/products/lookup" component={ProductLookup} />
        <PrivateRoute exact path="/products/:id/edit" component={ProductEdit} />
        <PrivateRoute
          exact
          path="/products/:id/delete"
          component={ProductDelete}
        />
        <PrivateRoute
          exact
          path="/products/discount"
          component={ProductDiscount}
        />
        <Route
          exact
          path="/customers"
          render={() => renderWithLayout(Customers)}
        ></Route>
        <Route
          exact
          path="/customers/add"
          render={() => renderWithLayout(CustomerForm)}
        ></Route>
        <Route
          exact
          path="/customers/:customer_id/view"
          render={(props) => renderWithLayout(CustomerProfile, props)}
        ></Route>
        <Route
          exact
          path="/customers/:customer_id/edit"
          render={(props) => {
            return renderWithLayout(CustomerForm, props, {
              isCustomerEditMode: true,
            });
          }}
        ></Route>

        <Route
          exact
          path="/customers/profile"
          render={() => renderWithLayout(CustomerProfile)}
        ></Route>
        <Route
          exact
          path="/customers/:customer_id/pay-account-balance"
          render={(props) => renderWithLayout(CustomerPay, props)}
        ></Route>
        <Route
          exact
          path="/customers/:customer_id/credit-history"
          render={(props) => renderWithLayout(CustomerCreditHistory, props)}
        ></Route>
        <Route
          exact
          path="/signup"
          render={() => authRenderWithLayout(SignUp)}
        ></Route>
        <Route
          exact
          path="/signin"
          render={() => authRenderWithLayout(SignIn)}
        ></Route>
        <PrivateRoute exact path="/outlets" component={Outlet} />
        <PrivateRoute exact path="/categories/add" component={CategoryAdd} />
        <PrivateRoute
          exact
          path="/categories/:id/edit"
          component={EditCategory}
        />
        <PrivateRoute
          exact
          path="/categories/:id/delete"
          component={DeleteCategory}
        />
        <PrivateRoute exact path="/couriers" component={Couriers} />
        <PrivateRoute exact path="/couriers/add" component={CourierAdd} />
        <PrivateRoute exact path="/couriers/:id/edit" component={CourierEdit} />
        <PrivateRoute
          exact
          path="/couriers/:id/delete"
          component={CourierDelete}
        />
        <PrivateRoute exact path="/categoryWise" component={CategoryWise} />
        <PrivateRoute exact path="/inventoryDump" component={InventoryDump} />
        <PrivateRoute
          exact
          path="/omniSalesSummary"
          component={OmniSalesSummary}
        />

        <PrivateRoute exact path="/productHistory" component={ProductHistory} />
        <PrivateRoute exact path="/salesSummary" component={SalesSummary} />

        <PrivateRoute exact path="/stock" component={Stock} />
        <PrivateRoute exact path="/stock/order" component={PurchaseOrder} />

        <PrivateRoute exact path="/setup" component={Setup} />
        <PrivateRoute exact path="/setup/outlet/add" component={OutletAdd} />
        <PrivateRoute exact path="/setup/user/add" component={UserAdd} />
        <PrivateRoute exact path="/setup/receipt/add" component={ReceiptAdd} />

        <PrivateRoute exact path="/register/sell" component={Sell} />
        <PrivateRoute
          exact
          path="/register/salesHistory"
          component={SalesHistory}
        />
      </Switch>
    </div>
  );
};

export default Routes;
