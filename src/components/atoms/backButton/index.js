import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

import { LeftOutlined } from "@ant-design/icons";

const BackButton = () => {
  return (
    <Link to="#" className="back-button">
      <LeftOutlined />
    </Link>
  );
};

export default BackButton;
