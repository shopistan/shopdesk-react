import React from "react";
import { Route, Switch } from "react-router-dom";

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
import SignUp from "./components/pages/signUp";
import SignIn from "./components/pages/signIn";
import Outlet from "./components/pages/outlet";

const renderWithLayout = (Component, props) => (
  <AppShell {...props}>
    <Component />
  </AppShell>
);

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route
          path='/dashboard'
          render={() => renderWithLayout(Dashboard)}
        ></Route>
        <Route
          exact
          path='/categories'
          render={() => renderWithLayout(Categories)}
        ></Route>
        <Route
          exact
          path='/categories/add'
          render={() => renderWithLayout(CategoryAdd)}
        ></Route>
        <Route
          exact
          path='/suppliers'
          render={() => renderWithLayout(Suppliers)}
        ></Route>
        <Route
          exact
          path='/suppliers/add'
          render={() => renderWithLayout(SupplierAdd)}
        ></Route>
        <Route
          exact
          path='/taxes'
          render={() => renderWithLayout(Taxes)}
        ></Route>
        <Route
          exact
          path='/taxes/add'
          render={() => renderWithLayout(TaxAdd)}
        ></Route>
        <Route
          exact
          path='/products'
          render={() => renderWithLayout(Products)}
        ></Route>
        <Route
          exact
          path='/products/add'
          render={() => renderWithLayout(ProductAdd)}
        ></Route>
        <Route
          exact
          path='/signup'
          render={() => renderWithLayout(SignUp)}
        ></Route>
        <Route
          exact
          path='/signin'
          render={() => renderWithLayout(SignIn)}
        ></Route>
        <Route
          exact
          path='/outlet'
          render={() => renderWithLayout(Outlet)}
        ></Route>
      </Switch>
    </div>
  );
};

export default Routes;
