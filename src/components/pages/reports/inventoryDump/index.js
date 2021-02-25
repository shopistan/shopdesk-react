import React from "react";
import "../style.scss";

import { Button, Badge } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const InventoryDump = () => {
  const [show, setShow] = React.useState(true);

  return (
    <div className='page reports'>
      <div className='page__header'>
        <h1>Inventory Dump</h1>

        <Button type='primary' icon={<DownloadOutlined />}>
          Download
        </Button>
      </div>

      <div className='page__content'>
        <div className='action-row'>
          <Badge
            className='site-badge-count-109'
            count={show ? 109 : 0}
            style={{ backgroundColor: "#52c41a" }}
          />
        </div>

        <div className='page__table'>{/* Insert Table Here */}</div>
      </div>
    </div>
  );
};

export default InventoryDump;
