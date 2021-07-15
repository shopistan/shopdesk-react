import React, { useEffect } from 'react';
import "./printSalesOrder.scss";
import moment from 'moment';


const PrintSalesInvoice = (props) => {
    const { SalesInvoiceDataArr = [], selectedOutlet = null } = props;

    //console.log(props);

    function isEmptyDict(obj) {
        return Object.keys(obj).length === 0;
    }

    useEffect(() => {

    }, []);




    return (

        <div id="printSalesInvoiceBulkView">

            <div className="clearfix"></div>
            <hr />

            {
                (SalesInvoiceDataArr.length > 0) && SalesInvoiceDataArr.map((obj, index) => {

                    let products = obj.invoice_products;
                    let invoiceData = obj.invoice_data;
                    let total = 0;
                    products.forEach((pro) => {
                        total += parseFloat(pro.invoice_junction_sale_total);
                    });
                    total += parseFloat(
                        invoiceData.invoice_shipping_price
                    );
                    total -= parseFloat(invoiceData.invoice_discount);


                    return (
                        <>

                            <div style={{ overflowX: "auto" }}>
                            
                                <h2 id="omni-sale-order-heading">
                                    Sale Order # {obj.invoice_data && obj.invoice_data.invoice_reference_id}
                                </h2>

                                <div style={{ display: "flex" }}>

                                    { (!isEmptyDict(obj.invoice_data) && selectedOutlet ) && <div style={{ width: "50%" }}>
                                        <h4 style={{ background: "#f3f3f3", padding: "10px", borderRadius: "4px" }}>Invoice</h4>
                                        <table className="print-sales-Bulk-table"
                                            style={{ width: "100%" }}>
                                            <tr>
                                                <td><b>Status</b></td>
                                                <td>
                                                    {obj.invoice_data.invoice_status === "3" ? "Sale Order"
                                                        : obj.invoice_data.invoice_status === "4" ? "Completed"
                                                            : obj.invoice_data.invoice_status === "5" ? "Canceled"
                                                                : obj.invoice_data.invoice_status === "6" ? "Returned"
                                                                    : ""
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><b>Region</b></td>
                                                <td>{obj.invoice_data.invoice_region || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Dated</b></td>
                                                <td>{moment(obj.invoice_data.invoice_datetime).format("DD MMM, yyyy hh:mm A")}</td>
                                            </tr>
                                            <tr>
                                                <td><b>MOP</b></td>
                                                <td>{obj.invoice_data.invoice_method || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Coupon Discount</b></td>
                                                <td>{selectedOutlet.currency_symbol + parseFloat(obj.invoice_data.invoice_discount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Shipping method</b></td>
                                                <td>{obj.invoice_data.invoice_shipping_method || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Shipping cost</b></td>
                                                <td>{selectedOutlet.currency_symbol + parseFloat(obj.invoice_data.invoice_shipping_price).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Total</b></td>
                                                <td>{selectedOutlet.currency_symbol + parseFloat(total).toFixed(2) }</td>
                                            </tr>

                                        </table>
                                    </div>}

                                    { !isEmptyDict(obj.customer_info) && <div style={{ width: "50%" }}>
                                        <h4 style={{ background: "#f3f3f3", padding: "10px", borderRadius: "4px" }}>Customer</h4>
                                        <table className="table"
                                            style={{ width: "100%" }}>
                                            <tr>
                                                <td><b>Name</b></td>
                                                <td>{obj.customer_info.customer_name || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Email</b></td>
                                                <td>{obj.customer_info.customer_email || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Phone</b></td>
                                                <td>{obj.customer_info.customer_phone || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Billing Address</b></td>
                                                <td>{obj.customer_info.billing_address || ""}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Shipping Address</b></td>
                                                <td>{obj.customer_info.shipping_address || ""}</td>
                                            </tr>

                                        </table>
                                    </div>}

                                </div>
                                
                                { (!isEmptyDict(obj.invoice_products) && selectedOutlet) && <div style={{width: "100%"}}>
                                    <h4 style={{ background: "#f3f3f3", padding: "10px", borderRadius: "4px" }}>Product(s)</h4><br />
                                    <div style={{ overflowY: "auto" }}>
                                        <table className="table table-hover table-bordered"
                                            style={{width: "100%"}}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Quantity</th>
                                                    <th>Actual price</th>
                                                    <th>Sold price</th>
                                                    <th>Sub-total</th>
                                                    <th>Discount</th>
                                                    <th>Premium</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {obj.invoice_products.map((item) => {
                                                    return (
                                                        <tr style={{textAlign: "center"}}>
                                                        <td>{item.product_name } <br /> <small>{item.product_sku}</small></td>
                                                        <td>{item.invoice_junction_quantity || ""}</td>
                                                        <td>{selectedOutlet.currency_symbol + parseFloat(item.Invoice_junction_perfect_sale).toFixed(2) }</td>
                                                        <td>{selectedOutlet.currency_symbol + parseFloat(item.invoice_junction_sale).toFixed(2) }</td>
                                                        <td>{selectedOutlet.currency_symbol + parseFloat(item.invoice_junction_sale_total).toFixed(2)  }</td>
                                                        <td>{parseFloat(item.Discount).toFixed(2)}</td>
                                                        <td>{parseFloat(item.premium).toFixed(2)}</td>
                                                    </tr>
                                                    )
                                                })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>}

                                <div class="clearfix"></div><hr />

                            </div>

                        </>

                    )

                })

            }

        </div>


    );


};


export default PrintSalesInvoice;
