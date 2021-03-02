import React from "react";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

function Users() {
  const history = useHistory();

  return (
    <div className="outlets">
      <div className="button-row">
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            history.push("/setup/user/add");
          }}
        >
          Add New
        </Button>
      </div>

      <div className="page__table"></div>
    </div>
  );
}

export default Users;
