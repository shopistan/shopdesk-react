import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
//import { useHistory } from 'react-router-dom';
import moment from 'moment';


const SaStockTable = (props) => {
    const [data, setData] = useState([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    //const history = useHistory();




    useEffect(() => {
        setData(props.tableData);
        if (props.paginationData && (currentPageNumber > Math.ceil(props.paginationData.totalPages))) {
            setcurrentPageNumber(1);
        }

    }, [props.tableData, props.tableDataLoading, props.paginationData, props.tableType]);  /* imp passing props to re-render */



    const showTotalItemsBar = (total, range) => {
        return `${range[0]}-${range[1]} of ${total} items`
    };
    
    const handlePageChange = (page,) => {
        setcurrentPageNumber(page)
        props.onClickPageChanger(page);
    };

    const handlePoQuickView = (record) => {
       //props.onPoQuickViewSelection(record);

    };
    
    
    
    var columns;

    
    if (props.tableType === 'inventory_transfers') {

        columns = [
            {
                title: "Name",
                dataIndex: "transfer_name",
            },
            {
                title: "Source outlet",
                dataIndex: "from_store",
            },
            {
                title: "Destination outlet",
                dataIndex: "to_store",
            },
            {
                title: "Sent date",
                dataIndex: 'transfer_date',
                render: (_, record) => {
                    return (
                      <span> { moment(record.transfer_date).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Received date",
                dataIndex: 'transfer_date_received',
                render: (_, record) => {
                    return (
                      <span> { record.transfer_date_received && moment(record.transfer_date_received).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Status",
                dataIndex: 'transfer_status',
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                Pending
                            </span>
                        </div>
                    );
                },
            },
            /*{
                title: "Action",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.transfer_status === '0'
                                    ? "-"
                                    : record.transfer_status === '2' ? "-"
                                    : record.transfer_from === props.currentStoreId ? "-"
                                    : "-"
                                }
                            </span>
                        </div>
                    );
                },
            }*/,
            {
                title: "Operations",
                dataIndex: "operation",
                render: (_, record) => {
                  return (
                      <div className='action-btns'>

                          <Button
                              type='primary'
                              //icon={<ProfileOutlined />}
                              className="custom-btn--primary"
                              onClick={(e) => e.preventDefault()}
                          >
                              Accept
                          </Button>
                          <Button
                              type='primary' danger
                              style={{marginLeft: "1.5rem"}}
                              //icon={<ProfileOutlined />}
                              onClick={(e) => e.preventDefault()}
                          >
                              Reject
                          </Button>

                      </div>
                  );
                },
            },
           
        ];

    } 




    if (props.tableType === 'purchase_orders') {

        columns = [
            {
                title: "PO #",
                dataIndex: "purchase_order_show_id",
            },
            {
                title: "Name",
                dataIndex: "purchase_order_name",
            },
            {
                title: "Ordered date",
                dataIndex: "purchase_order_order_datetime",
                render: (_, record) => {
                    return (
                      <span> { moment(record.purchase_order_order_datetime).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Due date",
                dataIndex: "purchase_order_delivery_datetime",
                render: (_, record) => {
                    return (
                      <span> { moment(record.purchase_order_delivery_datetime).format("MM DD, yyyy")} </span>
                    );
                },
            },
            {
                title: "Supplier",
                dataIndex: "supplier_name",
            },
            {
                title: "Status",
                dataIndex: "purchase_order_status",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                Pending
                            </span>
                        </div>
                    );
                },
            },
            /*{
                title: "Action",
                render: (_, record) => {
                    return (
                        <div className='action-btns'>
                            <span>
                                {record.purchase_order_status === '0'
                                    ? '-'
                                    : record.purchase_order_status === '2' ? "-"
                                    : record.purchase_order_status === '1' ? "-"
                                    : '-'
                                }
                            </span>
                        </div>
                    );
                },
            }*/ ,
            {
                title: "View",
                render: (_, record) => {
                    return (
                        <div className='sell-history-action-btn-quick-view'>
                            { (record.purchase_order_status === '1' || record.purchase_order_status === '0') &&
                                <EyeOutlined
                                    onClick={() => handlePoQuickView(record)}
                                />}
                        </div>
                    );
                },
            },
            {
                title: "Operations",
                dataIndex: "operation",
                render: (_, record) => {
                  return (
                      <div className='action-btns'>

                          <Button
                              type='primary'
                              //icon={<ProfileOutlined />}
                              className="custom-btn--primary"
                              onClick={(e) => e.preventDefault()}
                          >
                              Accept
                          </Button>
                          <Button
                              type='primary' danger
                              style={{marginLeft: "1.5rem"}}
                              //icon={<ProfileOutlined />}
                              onClick={(e) => e.preventDefault()}
                          >
                              Reject
                          </Button>

                      </div>
                  );
                },
            },

        ];

    }



    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
            }),
        };
    });



    return (
        <Table
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName='editable-row'
            className='table-frame'
            pagination={{
                total: props.paginationData && props.paginationData.totalElements,
                showTotal: (total, range) => showTotalItemsBar(total, range),
                defaultPageSize: 10,
                pageSize: parseInt(props.pageLimit),
                showSizeChanger: false,
                current: currentPageNumber,
                onChange: (page, pageSize) => handlePageChange(page, pageSize),
            }}
            rowKey={
                props.tableType === "purchase_orders" ?
                    "" : props.tableType === "inventory_transfers" && "transfer_id"

            }
            
        />

    );
};

export default SaStockTable;

