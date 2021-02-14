import React from "react";

import { DatePicker } from "antd";

function onChange(date, dateString) {
  console.log(date, dateString);
}

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <DatePicker onChange={onChange} />
    </div>
  );
};

export default Dashboard;
