import React, { useEffect } from 'react';
import "./printInvoice.scss";
import moment from 'moment';
import UrlConstants from '../../../../utils/constants/url-configs';


const PrintSalesInvoice = (props) => {
    const { selectedOutletTemplateData =  null } = props;


    useEffect(async () => {

    }, []);


    let templateImageSrc = '';
    let templateHeader = '';
    let templateFooter = '';

    /*if (props.user.template_data) {
        if (props.user.template_data.template_image) {
            //templateImageSrc = `${UrlConstants.IMAGE_UPLOADS_URL}/uploads/${props.user.template_data.template_image}`;    //imp prev
            templateImageSrc = `${props.user.template_data.template_image}`;    //new one
        }
        if (props.user.template_data.template_header) {
            templateHeader = props.user.template_data.template_header;
        }
    }*/

    if (selectedOutletTemplateData) {
        templateImageSrc = `${selectedOutletTemplateData.template_image}`;    //new one
        templateHeader = `${selectedOutletTemplateData.template_header}`;    //new one
        templateFooter = `${selectedOutletTemplateData.template_footer}`;    //new one
    }


    function removeHTML(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    let today = moment(props.invoice.dateTime).format("ddd MMM, yyyy HH:mm A");  
    let { invoice = "",  invoiceType = ""} = props;
    let userName = "";
    if(props.user){
        userName = props.user.user_info.user_name;
    } else {
        userName = invoice.user_name;
    }

    //console.log("print-data", props);
    


    return (

            <div id="printSalesTable">
                <center>
                    <img src={templateImageSrc}  style={{width: "10rem"}} /><br/> 
                    <b>{removeHTML(templateHeader)}</b><br />
                    <b>{removeHTML(templateFooter)}</b><br />
                    <div style={{ fontSize: "10px", marginTop: "7px" }}></div>

                    <span>Receipt / Tax Invoice</span><br /><br />
                    <b style={{fontSize: "10px"}}>Recipt #: </b> <span>{invoice.invoiceNo || invoice.invoice_unique}</span><br /> 
                    <b style={{fontSize: "10px"}}>Invoice Note: </b> <span>{invoice.reference || invoice.invoice_note}</span><br />
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
                                    <td  style={{textAlign: "center"}}>{pro.searchName || pro.product_name} </td>
                                    <td style={{textAlign: "center"}}>{pro.product_sale_price}</td>
                                    <td style={{textAlign: "center"}}>{(pro.qty*pro.product_sale_price).toFixed(2)}</td>
                                </tr>

                            )
                        })
                        }


                    </tbody>

                </table>
                
                {invoiceType !== "quick_view" && <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
                    <p><span><b>Subtotal</b></span><span style={{ right: "20px", position: "absolute" }}>{(invoice.sub_total).toFixed(2)}</span></p>
                    <p><span><b>Tax</b></span><span style={{ right: "20px", position: "absolute" }}>{(invoice.tax).toFixed(2)}</span></p>
                    <p><span><b>Discount</b></span><span style={{ right: "20px", position: "absolute" }}>{(invoice.discountAmount).toFixed(2)}</span></p>
                    <p style={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }}><b>Total</b><b style={{ right: "20px", position: "absolute" }}>{(invoice.total - invoice.discountAmount).toFixed(2)}</b></p>
                    <p><span><b>Cash</b></span><span style={{ right: "20px", position: "absolute" }}>{invoice.payed}</span></p>
                    <p><span><b>To Pay</b></span><span style={{ right: "20px", position: "absolute" }}> {(invoice.payed - (invoice.total - invoice.discountAmount)).toFixed(2)}</span></p>
                </div>}

                {invoiceType === "quick_view" && <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
                    <p><span><b>Subtotal</b></span><span style={{ right: "20px", position: "absolute" }}>{parseFloat(invoice.sale_total).toFixed(2)}</span></p>
                    <p><span><b>Tax</b></span><span style={{ right: "20px", position: "absolute" }}>{parseFloat(invoice.tax_total).toFixed(2)}</span></p>
                    <p><span><b>Discount</b></span><span style={{ right: "20px", position: "absolute" }}>{parseFloat(invoice.discounted_amount).toFixed(2)}</span></p>
                    <p style={{ borderBottom: "2px solid #000", borderTop: "2px solid #000" }}><b>Total</b><b style={{ right: "20px", position: "absolute" }}>{parseFloat((invoice.sale_total+ invoice.tax_total)  - invoice.discounted_amount).toFixed(2)}</b></p>
                </div>}

                <center style={{ borderBottom: "2px dotted #000", marginBottom: "5px; padding: 10px" }}>
                    <img src={`${UrlConstants.BASE_URL}/api/open/barcode/${invoice.invoiceNo || invoice.invoice_unique}`} style={{ width: "35%" }} />

                </center>
                <div style={{fontSize: "10px"}}>

                </div>
                <hr />

            </div>
        


    );
};

export default PrintSalesInvoice;
