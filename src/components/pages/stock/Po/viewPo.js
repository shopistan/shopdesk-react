import React, { useEffect } from 'react';
import "./printPo.scss";
import moment from 'moment';



const PrintSalesInvoice = (props) => {
    const { selectedOutletTemplateData =  null } = props;
    //console.log(props);



    useEffect( () => {

    }, []);


    let templateImageSrc = '';
    let templateHeader = '';
    let templateFooter = '';
    let templateFooterComplete = [];
    let templateHeaderComplete = [];
    let iterator = 0;

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
        //templateFooter = templateFooter.replace(/\n/g, '<br />');
        templateFooterComplete = templateFooter.split("\n");
        templateHeaderComplete = templateHeader.split("\n");
        //console.log(templateFooterComplete);
    }


    function removeHTML(str) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || "";
    }

    //let today = moment(props.poData.dateTime).format("ddd MMM, yyyy HH:mm A");  
    let { poData = "", currentOutlet = "" } = props;
    let userName = "";
    if(props.user){
        userName = props.user.user_info.user_name;
    } else {
        userName = "";
    }

    let currency = currentOutlet && currentOutlet.currency_symbol;
    currency = currency || "";
    let poInfo = poData && poData.purchase_order_info;

    //console.log("print-data", props);
    

    return (

            <div id="printPoTable">
                <center>
                    <img src={templateImageSrc}  style={{width: "6rem"}} /><br/> 
                    {templateHeaderComplete.length > 0 &&
                            templateHeaderComplete.map((item) => {
                                return (
                                    item !== "" && <> <b key={iterator++}>{item}</b><br /></>
                                )
                            })
                    }
                    <b style={{fontSize: "10px"}}>Sales Person: </b><span>{userName}</span><br />
                </center>


                <table className="print-purchase-order view-purchase-order"
                    style={{ width: "100%", borderBottom: "2px solid #000", borderTop: "2px solid #000" }}>
                    <thead>
                        <tr>
                            <th>Name / reference:</th>
                            <th>Order No: </th>
                            <th>Ordered date:</th>
                            <th>Due date:</th>
                            <th>Supplier:</th>
                        </tr>
                    </thead>
                    <tbody>


                    {poInfo &&
                        <tr key={poInfo.purchase_order_id} >

                            <td style={{ textAlign: "center" }}>{poInfo.purchase_order_name || ""} &nbsp; [Open] </td>
                            <td style={{ textAlign: "center" }}>{poInfo.purchase_order_show_id || ""} </td>
                            <td style={{ textAlign: "center" }}>{moment(poInfo.purchase_order_order_datetime).format("MM, DD, yyyy")} </td>
                            <td style={{ textAlign: "center" }}>{moment(poInfo.purchase_order_delivery_datetime).format("MM, DD, yyyy")} </td>
                            <td style={{ textAlign: "center" }}>{moment(poInfo.purchase_order_delivery_datetime).format("MM, DD, yyyy")} </td>

                        </tr>}

                    </tbody>

                </table>


                <table className="print-purchase-order view-purchase-order"
                    style={{width: "100%", borderBottom: "2px solid #000",}}> 
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Quantity ordered</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>

                        {poData.products.map(pro => {
                            return (

                                <tr key={pro.product_id} >
                                    <td style={{ textAlign: "center" }}>
                                        {
                                            pro.product_name &&
                                            <small>{pro.product_name + (pro.product_variant1_value ? `/ ${pro.product_variant1_value}` : "")
                                                + (pro.product_variant2_value ? `/ ${pro.product_variant2_value}` : "")}</small>
                                        }
                                    </td>

                                    <td  style={{textAlign: "center"}}>{pro.product_sku} </td>
                                    <td style={{textAlign: "center"}}>{pro.purchase_order_junction_quantity}</td>
                                    <td style={{textAlign: "center"}}>{(currency || "") + parseFloat(pro.purchase_order_junction_price).toFixed(2)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {
                                            <span>
                                                {
                                                    (currency || "") + (parseFloat(pro.purchase_order_junction_quantity) * parseFloat(pro.purchase_order_junction_price)).toFixed(2)

                                                }
                                            </span>

                                        }
                                    </td>

                                </tr>

                            )
                        })
                        }


                    </tbody>

                </table>
                
                <div style={{ width: "100%", borderBottom: "2px dotted #000" }}>
                    <p><span><b>Subtotal</b></span><span style={{ right: "20px", position: "absolute" }}>
                        {props.totalQty && parseFloat(props.totalQty).toFixed(2) }</span></p>
                </div>

                
                <hr />

                <div style={{ marginTop: "2rem" }}>
                    <center>
                        {templateFooterComplete.length > 0 &&
                            templateFooterComplete.map((item) => {
                                return (
                                    item !== "" && <> <b key={iterator++}>{item}</b><br /></>
                                )
                            })
                        }
                        <br />
                    </center>
                </div>


                <hr />

            </div>
        


    );
};

export default PrintSalesInvoice;
