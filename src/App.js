import React from "react";
import Routes from "./Routes";
import { Layout } from "antd";
import "./styles/index.scss";

function App() {
  return (
    <div className='App'>
      <Layout>
        <Routes />
      </Layout>
    </div>
  );
}

export default App;
