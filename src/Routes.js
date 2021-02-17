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
import SignUp from "./components/pages/signUp";
import SignIn from "./components/pages/signIn";
import Outlet from "./components/pages/outlet";
import EditCategory from "./components/pages/categories/editCategory";
import DeleteCategory from "./components/pages/categories/deleteCategory";


const Routes = () => {

  const renderWithLayout = (Component, props) => (
    <AppShell {...props}>
      <Component />
    </AppShell>
  );
  
  const authRenderWithLayout = (Component, props) => {
    const readFromLocalStorage =  JSON.parse(window.localStorage.getItem('user'));    
    return <AppShell {...props}>
              {readFromLocalStorage == null
                ?  <Component />
                : <Redirect to='/dashboard' />}
            </AppShell>
  }
  
  const PrivateRoute = ({ component: Component, ...rest }) => {
    const readFromLocalStorage =  JSON.parse(window.localStorage.getItem('user'));
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
        <PrivateRoute exact path='/outlet' component={Outlet} />
        <PrivateRoute exact path='/categories/add' component={CategoryAdd} /> 
        <PrivateRoute exact path='/categories/:id/edit' component={EditCategory} />
        <PrivateRoute exact path='/categories/:id/delete' component={DeleteCategory} />
      </Switch>
    </div>
  );
};

export default Routes;
