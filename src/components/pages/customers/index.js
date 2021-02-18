import React from "react";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import EditableTable from "../../organism/table";
import { useHistory } from "react-router-dom";

const Customers = () => {
  const history = useHistory();

  return (
    <div className='page categories'>
      <div className='page__header'>
        <h1>Customers</h1>

        <div className='page__header__buttons'>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => {
              history.push("/customers/add");
            }}
          >
            Add New
          </Button>

          <Button type='primary'>Fetch All</Button>

          <Button type='primary'>Export CSV</Button>
        </div>
      </div>
      <div className='page__content'>
        {/* Table */}
        <div className='table'>
          <EditableTable />
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Customers;
