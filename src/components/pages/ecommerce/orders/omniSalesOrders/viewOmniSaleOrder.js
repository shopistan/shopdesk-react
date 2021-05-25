
import React, { useEffect, useState } from "react";
import "../../style.scss";
import {
    Tabs,
    Menu,
    Dropdown,
    Button,
    Input,
    Select,
    message,
    Row,
    Col,
    Divider,
    Spin
} from "antd";
import { useHistory } from "react-router-dom";
import moment from 'moment';
import OmniSalesOrderProductsTable from "../../../../organism/table/ecommerce/omniSalesOrdersProductsTable";
import { ProfileOutlined, DownOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import * as EcommerceApiUtil from '../../../../../utils/api/ecommerce-api-utils';
import Constants from '../../../../../utils/constants/constants';
import {
    getDataFromLocalStorage,
} from "../../../../../utils/local-storage/local-store-utils";





const ViewOmniSaleOrder = (props) => {
    const { Search } = Input;
    const { Option } = Select;
    const history = useHistory();
    const [paginationLimit, setPaginationLimit] = useState(20);
    const [saleOrderCustomerInfo, setSaleOrdercustomerInfo] = useState(null);
    const [saleOrderInvoiceData, setSaleOrderInvoiceData] = useState(null);
    const [saleOrderProductsData, setSaleOrderProducts] = useState([]);
    const [saleOrdersInvoiceTotal, setSaleOrdersInvoiceTotal] = useState(0);
    const [userLocalStorageData, setUserLocalStorageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { match = {} } = props;
    const { invoice_id = {} } = match !== undefined && match.params;


    var mounted = true;



    useEffect(() => {
        if (invoice_id !== undefined) {
            fetchOeSaleOrderData(invoice_id);
            /*--------------set user local data-------------------------------*/
            var readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
            readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
            setUserLocalStorageData(readFromLocalStorage);
            /*--------------set user local data-------------------------------*/
        }
        else {
            message.error("Invoice Id cannot be null", 2);
            setTimeout(() => {
                history.goBack();
            }, 1000);
        }

        return () => {
            mounted = false;
        }

    }, []);




    const fetchOeSaleOrderData = async (invoice_id) => {

        document.getElementById('app-loader-container').style.display = "block";
        const fetchOeSaleOrderViewResponse = await EcommerceApiUtil.getOeSaleOrderData(invoice_id);
        console.log('fetchOeSaleOrderViewResponse:', fetchOeSaleOrderViewResponse);

        if (fetchOeSaleOrderViewResponse.hasError) {
            console.log('Cant fetch Oe Sales Orders Data -> ', fetchOeSaleOrderViewResponse.errorMessage);
            message.error(fetchOeSaleOrderViewResponse.errorMessage, 3);
            setLoading(false);
            document.getElementById('app-loader-container').style.display = "none";
        }
        else {
            console.log('res -> ', fetchOeSaleOrderViewResponse);
            if (mounted) {     //imp if unmounted
                message.success(fetchOeSaleOrderViewResponse.message, 3);
                setSaleOrdercustomerInfo(fetchOeSaleOrderViewResponse.customer_info);
                setSaleOrderInvoiceData(fetchOeSaleOrderViewResponse.invoice_data);
                setSaleOrderProducts(fetchOeSaleOrderViewResponse.invoice_products);
                let products = fetchOeSaleOrderViewResponse.invoice_products;
                let invoiceData = fetchOeSaleOrderViewResponse.invoice_data;
                let total = 0;

                products.forEach((pro) => {
                    total += parseFloat(pro.invoice_junction_sale_total);
                });

                total += parseFloat(
                    invoiceData.invoice_shipping_price
                );

                total -= parseFloat(invoiceData.invoice_discount);
                setSaleOrdersInvoiceTotal(total);
                setLoading(false);
                document.getElementById('app-loader-container').style.display = "none";
            }
        }

    }



    const cancelOeSalesOrders = async () => {
        let invoices = [invoice_id];
        //console.log(invoices);
        document.getElementById('app-loader-container').style.display = "block";
        const hide = message.loading('Saving Changes in progress..', 0);
        const cancelOeSalesOrdersResponse = await EcommerceApiUtil.cancelOeSalesOrders(invoices);
        console.log('cancelOeSalesOrdersResponse:', cancelOeSalesOrdersResponse);
    
        if (cancelOeSalesOrdersResponse.hasError) {
          console.log('Cant Confirm Oe Sales Orders Data -> ', cancelOeSalesOrdersResponse.errorMessage);
          message.error(cancelOeSalesOrdersResponse.errorMessage, 2);
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(hide, 1000);
        }
        else {
          console.log('res -> ', cancelOeSalesOrdersResponse);
          if (mounted) {     //imp if unmounted
            message.success(cancelOeSalesOrdersResponse.message, 2);
            document.getElementById('app-loader-container').style.display = "none";
            setTimeout(hide, 1000);
            setLoading(true);
            fetchOeSaleOrderData(invoice_id);
    
          }
        }
    }



    const confirmOeSalesOrders = async () => {
        let invoices = [invoice_id];
        document.getElementById('app-loader-container').style.display = "block";
        const hide = message.loading('Saving Changes in progress..', 0);
        const confirmOeSalesOrdersResponse = await EcommerceApiUtil.confirmOeSalesOrders(invoices);
        console.log('confirmOeSalesOrdersResponse:', confirmOeSalesOrdersResponse);
    
        if (confirmOeSalesOrdersResponse.hasError) {
          console.log('Cant Confirm Oe Sales Orders Data -> ', confirmOeSalesOrdersResponse.errorMessage);
          message.error(confirmOeSalesOrdersResponse.errorMessage, 2);
          document.getElementById('app-loader-container').style.display = "none";
          setTimeout(hide, 1000);
        }
        else {
          console.log('res -> ', confirmOeSalesOrdersResponse);
          if (mounted) {     //imp if unmounted
            message.success(confirmOeSalesOrdersResponse.message, 2);
            document.getElementById('app-loader-container').style.display = "none";
            setTimeout(hide, 1000);
            setLoading(true);
            fetchOeSaleOrderData(invoice_id);
          }
        }
    }



    const handlePrintOverview = (e) => {
        var previewSalesHtml = document.getElementById("omni-sales-orders-view").innerHTML;
        var previewSalesHtmlHeading = document.getElementById("omni-sale-order-heading").innerHTML;
        var doc =
            '<html><head><title>Close Me ~ Shopdesk</title><link rel="stylesheet" type="text/css" /></head><body onload="window.print(); window.close();">' +
            previewSalesHtmlHeading + previewSalesHtml +
            "</body></html>";
        /* NEW TAB OPEN PRINT */
        /* NEW TAB OPEN PRINT */
        var popupWin = window.open("", "_blank");
        popupWin.document.open();
        // window.print(); window.close(); 'width: 80%, height=80%'
        popupWin.document.write(doc);
        //popupWin.document.close();  //vvimp for autoprint
        
    };




    const handleCancel = () => {
        history.push({
            pathname: '/ecommerce/orders',
        });
    };






    const saleOrdrsViewMenu = (
        <Menu>
            {(saleOrderInvoiceData && (saleOrderInvoiceData.invoice_status === "3" || 
                saleOrderInvoiceData.invoice_status === "4")) &&
            <Menu.Item key="0" onClick={cancelOeSalesOrders}>
                Cancel Order
            </Menu.Item>}
            <Menu.Item key="1" onClick={handlePrintOverview}>
                Print
           </Menu.Item>

            {(saleOrderInvoiceData && saleOrderInvoiceData.invoice_status === "3") &&
                <Menu.Item key="2" onClick={confirmOeSalesOrders}>
                    Make Invoice
            </Menu.Item>}

        </Menu>
    );



    return (
        <div id="omni-sale-order-page"  className="page ecom-orders">

            <div className="page__header">
                <Button type="primary" shape="circle"
                    className="back-btn"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleCancel}
                 />
                <h2 id="omni-sale-order-heading">
                    Sale Order # {saleOrderInvoiceData && saleOrderInvoiceData.invoice_reference_id}
                </h2>

                <div className="page__header__buttons">
                    <Dropdown overlay={saleOrdrsViewMenu} trigger={["click"]}>
                        <Button
                            type="Default"
                            icon={<DownOutlined />}
                            onClick={(e) => e.preventDefault()}
                        >
                            More <ProfileOutlined />
                        </Button>
                    </Dropdown>
                </div>
            </div>



            {!loading &&
                <div id="omni-sales-orders-view" className="page__content omni-sales-orders-view">

                    <Row gutter={20, 20} className="omni-sale-row-heading">

                        <Col xs={24} sm={24} md={12} className="sale-order-item-content">
                            <h4 className="sale-order-details-heading">Details</h4>

                            {saleOrderInvoiceData && userLocalStorageData &&
                                <>

                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Status &nbsp;&nbsp;&nbsp;
                                        </span>

                                        <span className={saleOrderInvoiceData.invoice_status === "3" && 'ecommerce-sale-order' ||
                                            saleOrderInvoiceData.invoice_status === "4" && 'ecommerce-sale-order-completed' ||
                                            saleOrderInvoiceData.invoice_status === "5" && 'ecommerce-sale-order-canceled' ||
                                            saleOrderInvoiceData.invoice_status === "6" && 'ecommerce-sale-order-returned'
                                        }
                                        >
                                            {saleOrderInvoiceData.invoice_status === "3" ? "Sale Order"
                                                : saleOrderInvoiceData.invoice_status === "4" ? "Completed"
                                                    : saleOrderInvoiceData.invoice_status === "5" ? "Canceled"
                                                        : saleOrderInvoiceData.invoice_status === "6" ? "Returned"
                                                            : ""
                                            }
                                        </span>

                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Region &nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>{saleOrderInvoiceData.invoice_region}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Dated &nbsp;&nbsp;&nbsp; </span>
                                        <span>{moment(saleOrderInvoiceData.invoice_datetime).format("DD MMM, yyyy hh:mm A")}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            MOP &nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>{saleOrderInvoiceData.invoice_method}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Coupon Discount &nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>{parseFloat(saleOrderInvoiceData.invoice_discount).toFixed(2)}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Shipping method &nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>{saleOrderInvoiceData.invoice_shipping_method}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Shipping cost &nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>{parseFloat(saleOrderInvoiceData.invoice_shipping_price).toFixed(2)}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Total &nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>
                                            {userLocalStorageData.currency.symbol+parseFloat(saleOrdersInvoiceTotal).toFixed(2)}
                                        </span>
                                    </Col>

                                </>
                            }

                        </Col>

                        <Col xs={24} sm={24} md={12} className="stock-item-content">
                            <h4 className="sale-order-details-heading">Customer</h4>

                            {saleOrderCustomerInfo &&
                                <>

                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Name &nbsp;&nbsp;&nbsp;
                                    </span>
                                        <span>{saleOrderCustomerInfo.customer_name}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Email &nbsp;&nbsp;&nbsp;
                                    </span>
                                        <span>{saleOrderCustomerInfo.customer_email}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Phone &nbsp;&nbsp;&nbsp;
                                    </span>
                                        <span>{saleOrderCustomerInfo.customer_phone}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Billing Address  &nbsp;&nbsp;&nbsp;
                                    </span>
                                        <span>{saleOrderCustomerInfo.billing_address}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                                        <span className="sale-order-item-content-font">
                                            Shipping Address &nbsp;&nbsp;&nbsp;
                                    </span>
                                        <span>{saleOrderCustomerInfo.shipping_address}</span>
                                    </Col>
                                </>
                            }

                        </Col>


                    </Row>

                    <h4 className="sale-order-products-heading">
                        products
                    </h4>

                    <Row gutter={16, 16}>
                        <Col xs={24} sm={24} md={24} className="sale-order-item-content">
                            {/* Table */}
                            <div className='table'>
                                <OmniSalesOrderProductsTable
                                    pageLimit={paginationLimit}
                                    tableData={saleOrderProductsData}
                                    tableDataLoading={loading}
                                    currency={userLocalStorageData.currency.symbol}
                                />
                            </div>
                            {/* Table */}
                        </Col>
                    </Row>
                    <Divider />

                </div>}
        </div>
    );
}

export default ViewOmniSaleOrder;
