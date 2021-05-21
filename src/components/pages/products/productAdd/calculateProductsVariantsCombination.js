
export const calculateVaraintsCombinations = (variant1Tags, variant2Tags, formValues, userStores, storeInventoryQty) => {

    //console.log("changed", formValues);
    //console.log("varaintsvales1", variant1Tags);
    //console.log("varaintsvales2", variant2Tags);
    //console.log("userstores", storeInventoryQty);


    var productsVariantsCombinations = [];
    var singleVariantObjectRow = {};
    var combineVariantsLength = 0;

    //////////////logic////////////
    if (variant1Tags.length === 0) {


        variant2Tags.forEach((itemObj2, index) => {
            singleVariantObjectRow.variant_row_id = index.toString();
            singleVariantObjectRow.var1_text = "";
            singleVariantObjectRow.var2_text = itemObj2;
            //singleVariantObjectRow.sku = formValues.sku || "";   //imp prev
            let variantSku = "";
            singleVariantObjectRow.sku =  variantSku;
            singleVariantObjectRow.sale = formValues.sale_price || 0;
            singleVariantObjectRow.purchase = formValues.purchase_price || 0;
            ///////////outletInfo////////
            var singleVariantOutletObjRow = [];
            var singleVariantOutletOpenQtyObjRow = [];

            userStores.forEach((storeObj, indx) => {
                singleVariantOutletObjRow.push({ store_id: storeObj.store_id, qty: 0, tax_id: formValues.tax || "" });
                singleVariantOutletOpenQtyObjRow.push({ store_id: storeObj.store_id, qty: storeInventoryQty[`${storeObj.store_id}`] || 0 });

            })
            ///////////outletInfo////////

            singleVariantObjectRow.outletInfo = singleVariantOutletObjRow;
            singleVariantObjectRow.qty = singleVariantOutletOpenQtyObjRow;

            productsVariantsCombinations.push(singleVariantObjectRow);
            singleVariantObjectRow = {};

        });  /*--end  for loop--*/


    }

    else {

        variant1Tags.forEach((itemObj1, index) => {


            if (variant2Tags.length === 0) {
                singleVariantObjectRow.variant_row_id = index.toString();
                singleVariantObjectRow.var1_text = itemObj1;
                singleVariantObjectRow.var2_text = "";
                //singleVariantObjectRow.sku = formValues.sku || "";  //imp prev
                let prodSku = formValues.sku || "";
                let variantSku = prodSku + "-" + itemObj1 + "-" + "Default";
                singleVariantObjectRow.sku =  variantSku;
                singleVariantObjectRow.sale = formValues.sale_price || 0;
                singleVariantObjectRow.purchase = formValues.purchase_price || 0;
                ///////////outletInfo////////
                var singleVariantOutletObjRow = [];
                var singleVariantOutletOpenQtyObjRow = [];

                userStores.forEach((storeObj, indx) => {
                    singleVariantOutletObjRow.push({ store_id: storeObj.store_id, qty: 0, tax_id: formValues.tax || "" });
                    singleVariantOutletOpenQtyObjRow.push({ store_id: storeObj.store_id, qty: storeInventoryQty[`${storeObj.store_id}`] || 0 });

                })
                ///////////outletInfo////////

                singleVariantObjectRow.outletInfo = singleVariantOutletObjRow;
                singleVariantObjectRow.qty = singleVariantOutletOpenQtyObjRow;


                productsVariantsCombinations.push(singleVariantObjectRow);  //imp
                singleVariantObjectRow = {};

            }

            else {

                variant2Tags.forEach((itemObj2, index) => {
                    singleVariantObjectRow.variant_row_id = (combineVariantsLength++).toString();
                    singleVariantObjectRow.var1_text = itemObj1;
                    singleVariantObjectRow.var2_text = itemObj2;
                    //singleVariantObjectRow.sku = formValues.sku || "";    //imp prev
                    let prodSku = formValues.sku || "";
                    let variantSku = prodSku + "-" + itemObj1 + "-" + itemObj2;
                    singleVariantObjectRow.sku =  variantSku;
                    singleVariantObjectRow.sale = formValues.sale_price || 0;
                    singleVariantObjectRow.purchase = formValues.purchase_price || 0;
                    ///////////outletInfo////////
                    var singleVariantOutletObjRow = [];
                    var singleVariantOutletOpenQtyObjRow = [];

                    userStores.forEach((storeObj, indx) => {
                        singleVariantOutletObjRow.push({ store_id: storeObj.store_id, qty: 0, tax_id: formValues.tax || "" });
                        singleVariantOutletOpenQtyObjRow.push({ store_id: storeObj.store_id, qty: storeInventoryQty[`${storeObj.store_id}`] || 0 });

                    })
                    ///////////outletInfo////////

                    singleVariantObjectRow.outletInfo = singleVariantOutletObjRow;
                    singleVariantObjectRow.qty = singleVariantOutletOpenQtyObjRow;

                    productsVariantsCombinations.push(singleVariantObjectRow);  //imp
                    singleVariantObjectRow = {};


                });  /*--end of inner for loop--*/

            }

        }); /*--end of main  foreach--*/

        combineVariantsLength = 0;  //imp

    }


    ////////////////////////////////

    //console.log(productsVariantsCombinations);

    return productsVariantsCombinations;


    /*---logic---*/

};




