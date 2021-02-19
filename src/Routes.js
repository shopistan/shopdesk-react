import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

// Components
import AppShell from "./components/pages/appShell";
import Dashboard from "./components/pages/dashboard";
import Categories from "./components/pages/categories";
import CategoryAdd from "./components/pages/categories/categoryAdd";
import Suppliers from "./components/pages/suppliers";
import SupplierAdd from "./components/pages/suppliers/supplierAdd";
import Taxes from "./components/pages/taxes";
import TaxAdd from "./components/pages/taxes/taxAdd";
import Products from "./components/pages/products";
import ProductAdd from "./components/pages/products/productAdd";
import ProductDiscount from "./components/pages/products/productDiscount";
import ProductLookup from "./components/pages/products/productLookup";
import ProductUpload from "./components/pages/products/productUpload";
import Customers from "./components/pages/customers";
import CustomerAdd from "./components/pages/customers/customerAdd";
import Couriers from "./components/pages/couriers";
import CourierAdd from "./components/pages/couriers/courierAdd";
import SignUp from "./components/pages/signUp";
import SignIn from "./components/pages/signIn";
import Outlet from "./components/pages/outlet";
import EditCategory from "./components/pages/categories/editCategory";
import DeleteCategory from "./components/pages/categories/deleteCategory";
import { getDataFromLocalStorage  } from "./utils/local-storage/local-store-utils";


const Routes = () => {

  const renderWithLayout = (Component, props) => (
    <AppShell {...props}>
      <Component />
    </AppShell>
  );
  
  const authRenderWithLayout = (Component, props) => {
    var readFromLocalStorage =  getDataFromLocalStorage('user');
    readFromLocalStorage =  readFromLocalStorage.data ? readFromLocalStorage.data : null;
    return <AppShell {...props}>
              {readFromLocalStorage == null
                ?  <Component />
                : <Redirect to='/dashboard' />}
            </AppShell>
  }
  
  const PrivateRoute = ({ component: Component, ...rest }) => {
    var readFromLocalStorage =  getDataFromLocalStorage('user');
    readFromLocalStorage =  readFromLocalStorage.data ? readFromLocalStorage.data : null;
    return <Route {...rest} render={(props) => (
              readFromLocalStorage !== null
                ?  renderWithLayout(Component,  {...props}) 
                : <Redirect to='/signin' />
            )} />
  }
  
  return (
    <div>
      <Switch>
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/categories' component={Categories} />
        <PrivateRoute exact path='/suppliers' component={Suppliers} />
        <PrivateRoute exact path='/suppliers/add' component={SupplierAdd} />
        <PrivateRoute exact path='/taxes' component={Taxes} />
        <PrivateRoute exact path='/taxes/add' component={TaxAdd} />
        <PrivateRoute exact path='/products' component={Products} />
        <PrivateRoute exact path='/products/add' component={ProductAdd} />
        <PrivateRoute exact path='/products/upload' component={ProductUpload} />
        <PrivateRoute exact path='/products/lookup' component={ProductLookup} />
        <PrivateRoute exact path='/products/discount' component={ProductDiscount} />
        <Route
          exact
          path='/customers'
          render={() => renderWithLayout(Customers)}
        ></Route>
        <Route
          exact
          path='/customers/add'
          render={() => renderWithLayout(CustomerAdd)}
        ></Route>
        <Route
          exact
          path='/couriers'
          render={() => renderWithLayout(Couriers)}
        ></Route>
        <Route
          exact
          path='/couriers/add'
          render={() => renderWithLayout(CourierAdd)}
        ></Route>
        <Route
          exact
          path='/signup'
          render={() => authRenderWithLayout(SignUp)}
        ></Route>
         <Route
          exact
          path='/signin'
          render={() => authRenderWithLayout(SignIn)}
        ></Route>
        <PrivateRoute exact path='/outlets' component={Outlet} />
        <PrivateRoute exact path='/categories/add' component={CategoryAdd} /> 
        <PrivateRoute exact path='/categories/:id/edit' component={EditCategory} />
        <PrivateRoute exact path='/categories/:id/delete' component={DeleteCategory} />
      </Switch>
    </div>
  );
};

export default Routes;
