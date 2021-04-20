import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import "./style.scss";
import moment from 'moment';



const ProductsMovementReportTable = (props) => {
    const [data, setData] = useState(null);



    useEffect(() => {
        setData(props.tableData);
        //console.log("info-table", props.tableData);

    }, [props.tableData]);  /* imp passing props to re-render */




    return (


        <div id={`${props.tableId}`} style={{ overflowX: "auto" }}>
            {data &&
                <>

                    <div style={{ overflowX: "auto" }}>
                        <table className="category-table category-table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Variant 1</th>
                                    <th>Variant 2</th>
                                    <th>Cost Price</th>
                                    <th>Sale Price</th>
                                    <th>Tax Name</th>
                                    <th>Tax Vale</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data.product_info.name}</td>
                                    <td>{data.product_info.sku}</td>
                                    <td>{data.product_info.variant1}</td>
                                    <td>{data.product_info.variant2}</td>
                                    <td>{parseFloat(data.product_info.cost_price).toFixed(2)}</td>
                                    <td>{parseFloat(data.product_info.sale_price).toFixed(2)}</td>
                                    <td>{parseFloat(data.product_info.tax_name).toFixed(2)}</td>
                                    <td>{parseFloat(data.product_info.tax_value).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Divider />

                    <div className='form__section__header'>
                        <h3 className='variants-heading'>Product History</h3>
                    </div>

                    <table className="category-table category-table-bordered" style={{ width: "100%" }}>
                        <thead>
                            <tr>

                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Supplier</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="3" style={{ backgroundColor: "#eef9fb" }}><b>ORDERED</b></td>
                            </tr>

                            {data.ordered.map(order => {
                                return (
                                    <tr >
                                        <td>{moment(order.order_date).format("MM-DD-yyyy")}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.supp_name}</td>
                                    </tr>
                                )
                            })
                            }

                            <tr>
                                <td colSpan="3" style={{ backgroundColor: "#eef9fb" }}><b>RECIEVED</b></td>
                            </tr>

                            {data.recieved.map(rec => {
                                return (
                                    <tr >
                                        <td>{moment(rec.recieve_date).format("MM-DD-yyyy")}</td>
                                        <td>{rec.quantity}</td>
                                        <td></td>
                                    </tr>
                                )
                            })
                            }

                            <tr>
                                <td colSpan="3" style={{ backgroundColor: "#eef9fb" }}><b>SOLD</b></td>
                            </tr>

                            {data.sold.map(s => {
                                return (
                                    <tr >
                                        <td>{moment(s.sold_date).format("MM-DD-yyyy")}</td>
                                        <td>{s.quantity}</td>
                                        <td></td>
                                    </tr>
                                )
                            })
                            }

                        </tbody>
                    </table>

                </>
            }

        </div>
    );
};

export default ProductsMovementReportTable;

