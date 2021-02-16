import React from "react";
import { Route, Switch } from "react-router-dom";

// Components
import AppShell from "./components/pages/appShell";
import Dashboard from "./components/pages/dashboard";
import Categories from "./components/pages/categories";
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
          exact
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
