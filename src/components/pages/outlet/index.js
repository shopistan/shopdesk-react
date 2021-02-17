import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Outlet = () => {
  return (
    <div className='page outlet'>
      <div className='page__header'>
        <h1>Select an Outlet</h1>
      </div>

      <div className='page__content'>
        <ul className='outlet__select'>
          <li>
            <Link to='' className='outlet__link'>
              Outlet 1
            </Link>
          </li>
          <li>
            <Link to='' className='outlet__link'>
              Outlet 2
            </Link>
          </li>
          <li>
            <Link to='' className='outlet__link'>
              Outlet 3
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Outlet;
