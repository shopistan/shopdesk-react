import React, { useEffect } from 'react';
import "./print.scss";
import { useHistory } from "react-router-dom";
import moment from 'moment';
import UrlConstants from '../../../../utils/constants/url-configs';


const PrintOverviewSales = (props) => {
    const history = useHistory();

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

    let overviewStart = moment(props.calenderDates[0]).format("dd MMM , yyyy");
    let overviewEnd = moment(props.calenderDates[1]).format("dd MMM , yyyy");



    return (

        <div id="printTable">
            <center>
                <img src={templateImageSrc} style={{ width: "70" }} /><br />
                <div style={{ fontSize: "10px", marginTop: "7px" }}>
                    {removeHTML(templateHeader)}
                </div>

                <br /><span><strong>Sales overview</strong></span><br />
                <b style={{ fontSize: "10px" }}>DATE: </b> <span>{overviewStart} - {overviewEnd}</span><br />
            </center>
            <hr />

            <table class="print-sales-table sales-summary-invoice" style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <td>Cash</td>
                        <td style={{ float: "right" }}>{props.salesSummaryMopsData.cash.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Credit/Debit Card</td>
                        <td style={{ float: "right" }}>{props.salesSummaryMopsData.credit.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Customer Layby</td>
                        <td style={{ float: "right" }}>{props.salesSummaryMopsData.customer.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Discounts</td>
                        <td style={{ float: "right" }}>{props.salesSummaryMopsData.discounts.toFixed(2)}</td>
                    </tr>

                </tbody>
            </table>
            <hr />
            <table class="print-sales-table sales-summary-invoice">
                <tbody>
                    <tr>
                        <td>Total</td>
                        <td style={{ float: "right" }}>
                            {((props.salesSummaryMopsData.cash + props.salesSummaryMopsData.credit) - props.salesSummaryMopsData.discounts).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
        </div>


    );
};

export default PrintOverviewSales;
