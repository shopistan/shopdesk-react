import React from "react";

import { DatePicker } from "antd";

function onChange(date, dateString) {
  console.log(date, dateString);
}

const Dashboard = () => {
  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Dashboard</h1>
      </div>

      <div className='page__content'>
        <DatePicker onChange={onChange} />
      </div>
    </div>
  );
};

export default Dashboard;
