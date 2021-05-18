import React, { useState, useEffect } from "react";
import "./style.scss";


const CategorySalesSummaryTable = (props) => {
    const [data, setData] = useState([]);


    const showTotalItemsBar = (total, range) => {
        console.log(range);
        return `${range[0]}-${range[1]} of ${total} items`
    };

    useEffect(() => {
        setData(props.tableData);

    }, [props.tableData, props.tableDataLoading]);  /* imp passing props to re-render */



    return (

        <div  id={`${props.tableId}`} style={{ overflowX: "auto" }}>
            <table  className="category-table category-table-bordered" >
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Retail Price</th>
                        <th>Sale Price</th>
                        <th>Cost</th>
                        <th>Margin</th>
                        <th>Margin %</th>
                    </tr>
                </thead>

                <tbody >
                    {
                        data.map((item, index) => {

                            return (
                                <>
                                    <tr>
                                        <td colSpan="8" style={{ backgroundColor: "#eef9fb" }}><strong>{item.categoryName}</strong></td>
                                    </tr>

                                    {item.sales.map((salesObj, index) => {
                                        return (
                                            <tr>

                                                <td>{salesObj.product_sku}</td>
                                                <td>{salesObj.product_name}</td>
                                                <td>{parseFloat(salesObj.quantity).toFixed(2)}</td>
                                                <td>{parseFloat(salesObj.retail_price).toFixed(2)}</td>
                                                <td>{parseFloat(salesObj.sale_price).toFixed(2)}</td>
                                                <td>{parseFloat(salesObj.cost).toFixed(2)}</td>
                                                <td>{parseFloat(salesObj.margin).toFixed(2)}</td>
                                                <td>{parseFloat(salesObj.margin_percent).toFixed(2)}</td>
                                            </tr>
                                        )
                                    })
                                    }

                                    <tr>
                                        <td>&nbsp;</td>
                                        <td><strong>SUB-TOTAL</strong></td>
                                        <td><strong>{(item.meta.quantity).toFixed(2)}</strong></td>
                                        <td><strong>{(item.meta.retail_price).toFixed(2)}</strong></td>
                                        <td><strong>{(item.meta.sale_price).toFixed(2)}</strong></td>
                                        <td><strong>{(item.meta.cost).toFixed(2)}</strong></td>
                                        <td><strong>{(item.meta.margin).toFixed(2)}</strong></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="8"><strong>&nbsp;</strong></td>
                                    </tr>
                                </>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default CategorySalesSummaryTable;

