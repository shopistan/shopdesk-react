import React from "react";
import "./style.scss";

const Dashboard = () => {
  return (
    <div className='page dashboard'>
      <div className='page__header'>
        <h1>Dashboard</h1>
      </div>

      <div className='page__content'>
        <div className='page__section'>
          <h2>Daily Sales</h2>
        </div>
        <div className='page__section'>
          <h2>Info Boxes</h2>
        </div>
        <div className='page__section charts'>
          <div className='sales'>
            <h2>Sales History</h2>
          </div>

          <div className='items'>
            <h2>Most Sold Items</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
