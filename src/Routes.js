import React from "react";
import { Route, Switch } from "react-router-dom";

// Components
import AppShell from "./components/pages/appShell";
import Dashboard from "./components/pages/dashboard";
import Categories from "./components/pages/categories";

const renderWithLayout = (Component, props) => (
  <AppShell {...props}>
    <Component />
  </AppShell> 
);

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/dashboard" render={() => renderWithLayout(Dashboard)}></Route>
        <Route exact path="/categories" render={() => renderWithLayout(Categories)}></Route>
      </Switch>
    </div>
  )
}

export default Routes;