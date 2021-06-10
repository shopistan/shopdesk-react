import React, { useEffect, useState } from 'react';
import "./print.scss";
import moment from 'moment';
import UrlConstants from '../../../../utils/constants/url-configs';
import {
    getDataFromLocalStorage,
    checkUserAuthFromLocalStorage,
} from "../../../../utils/local-storage/local-store-utils";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import Constants from "../../../../utils/constants/constants";




const PrintOverviewSales = (props) => {
    const [templateData, setTemplateData] = useState(null);


    useEffect(() => {

        /*-----------set user store id-------------*/
        var userData = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
        userData = userData.data ? userData.data : null;

        if (userData) {
            if (
                checkUserAuthFromLocalStorage(Constants.USER_DETAILS_KEY).authentication
            ) {
                getUserStoreData(userData.auth.current_store);  //imp to get user outlet data


            }
        }
        /*-----------set user store id-------------*/


    }, []);


    const getUserStoreData = async (storeId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getOutletViewResponse = await SetupApiUtil.getOutlet(storeId);
        console.log('getOutletViewResponse:', getOutletViewResponse);

        if (getOutletViewResponse.hasError) {
            console.log('Cant fetch Store Data -> ', getOutletViewResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', getOutletViewResponse);
            let selectedStore = getOutletViewResponse.outlet;
            getTemplateData(selectedStore.template_id);   //imp to get template data

        }
    }


    const getTemplateData = async (templateId) => {

        const getTepmlateResponse = await SetupApiUtil.getTemplate(templateId);
        console.log('getTepmlateResponse:', getTepmlateResponse);

        if (getTepmlateResponse.hasError) {
            console.log('Cant get template Data -> ', getTepmlateResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            //message.warning(getTepmlateResponse.errorMessage, 3);
        }
        else {
            console.log('res -> ', getTepmlateResponse);
            var receivedTemplateData = getTepmlateResponse.template;
            setTemplateData(receivedTemplateData);
            document.getElementById('app-loader-container').style.display = "none";
            //message.success(getTepmlateResponse.message, 3);

        }
    }



    let templateImageSrc = '';
    let templateHeader = '';
    let templateHeaderComplete = [];
    let iterator = 0;

    /*if (props.user.template_data) {
        if (props.user.template_data.template_image) {
            templateImageSrc = `${UrlConstants.IMAGE_UPLOADS_URL}/uploads/${props.user.template_data.template_image}`;
        }
        if (props.user.template_data.template_header) {
            templateHeader = props.user.template_data.template_header
        }
    }*/

    if (templateData) {
        templateImageSrc = `${templateData.template_image}`;    //new one
        templateHeader = `${templateData.template_header}`;    //new one
        //templateFooter = `${templateData.template_footer}`;    //new one
        templateHeaderComplete = templateHeader.split("\n");
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
                <img src={templateImageSrc} style={{ width: "6rem" }} /><br />
                    {/*removeHTML(templateHeader)*/}
                    {templateHeaderComplete.length > 0 &&
                            templateHeaderComplete.map((item) => {
                                return (
                                    item !== "" && <> <b key={iterator++}>{item}</b><br /></>
                                )
                            })
                    }
                <br /><span><strong>Sales overview</strong></span><br />
                <b style={{ fontSize: "10px" }}>DATE: </b> <span>{overviewStart} - {overviewEnd}</span><br />
            </center>
            <hr />

            <table className="print-sales-table sales-summary-invoice" style={{ width: "100%" }}>
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
            <table className="print-sales-table sales-summary-invoice" style={{ width: "100%" }}>
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
