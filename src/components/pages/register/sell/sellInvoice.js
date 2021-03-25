import React, { useEffect } from 'react';
import "./printInvoice.scss";
import moment from 'moment';
import UrlConstants from '../../../../utils/constants/url-configs';


const PrintSalesInvoice = (props) => {


    useEffect(async () => {

    }, []);


    var templateImageSrc = '';
    var templateHeader = '';

    if (props.user.template_data) {
        if (props.user.template_data.template_image) {
            templateImageSrc = `${UrlConstants.IMAGE_UPLOADS_URL}/uploads/${props.user.template_data.template_image}`;
        }
        if (props.user.template_data.template_header) {
            templateHeader = props.user.template_data.template_header
        }
    }

    function removeHTML(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    var today = moment(props.invoice.dateTime).format("dd MMM , yyyy HH:mm:A");  
    var userName = props.user.user_info.user_name;
    var {invoice} = props;
    



    return (

            <div id="printSalesTable">
                <center>
                    <img src={templateImageSrc}  style={{width: "70"}} /><br/> 
                    <b>{removeHTML(templateHeader)}</b><br />
                    <div style={{ fontSize: "10px", marginTop: "7px" }}></div>

                    <span>Receipt / Tax Invoice</span><br /><br />
                    <b style={{fontSize: "10px"}}>Recipt #: </b> <span>{invoice.invoiceNo}</span><br />
                    <b style={{fontSize: "10px"}}>Date: </b> <span>{today}</span><br />
                    <b style={{fontSize: "10px"}}>Sales Person: </b><span>{userName}</span><br />
                </center>
                <table className="print-sales-invoice sales-invoice-table"
                    style={{width: "100%", borderBottom: "2px solid #000", borderTop: "2px solid #000"}}> 
                    <thead>
                        <tr>
                            <th>QTY</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>

                        {invoice.products.map(pro => {
                            return (

                                <tr key={pro.product_id} >
                                    <td style={{textAlign: "center"}}>{pro.qty}</td>
                                    <td  style={{textAlign: "center"}}>{pro.searchName} </td>
                                    <td style={{textAlign: "center"}}>{pro.product_sale_price}</td>
                                    <td style={{textAlign: "center"}}>{(pro.qty*pro.product_sale_price).toFixed(2)}</td>
                                </tr>

                            )
                        })
                        }


                    </tbody>

                </table>
                
                <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
                    <p><span><b>Subtotal</b></span><span style={{ right: "20px", position: "absolute" }}>{(invoice.sub_total).toFixed(2)}</span></p>
                    <p><span><b>Tax</b></span><span style={{ right: "20px", position: "absolute" }}>{(invoice.tax).toFixed(2)}</span></p>
                    <p><span><b>Discount</b></span><span style={{ right: "20px", position: "absolute" }}>{(invoice.discountAmount).toFixed(2)}</span></p>
                    <p style={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }}><b>Total</b><b style={{ right: "20px", position: "absolute" }}>{(invoice.total - invoice.discountAmount).toFixed(2)}</b></p>
                    <p><span><b>Cash</b></span><span style={{ right: "20px", position: "absolute" }}>{invoice.payed}</span></p>
                    <p><span><b>To Pay</b></span><span style={{ right: "20px", position: "absolute" }}> {(invoice.payed - (invoice.total - invoice.discountAmount)).toFixed(2)}</span></p>
                </div>
                <center style={{ borderBottom: "2px dotted #000", marginBottom: "5px; padding: 10px" }}>
                    <img src={`${UrlConstants.BASE_URL}/api/open/barcode/${invoice.invoiceNo}`} style={{ width: "35%" }} />

                </center>
                <div style={{fontSize: "10px"}}>

                </div>
                <hr />

            </div>
        


    );
};

export default PrintSalesInvoice;
