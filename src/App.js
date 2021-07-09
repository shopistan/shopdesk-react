import React from "react";
import Routes from "./Routes";
//import { GlobalStyle, theme } from "@teamfabric/copilot-ui";
import { Layout } from "antd";
import "./styles/index.scss";

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes />
      </Layout>
    </div>
  );
}

export default App;
