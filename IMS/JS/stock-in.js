
// =====================================
// STOCK IN
// INVENTORY MANAGEMENT SYSTEM
// =====================================


// =====================================
// GET INVENTORY FROM LOCAL STORAGE
// =====================================

let inventory =
    JSON.parse(
        localStorage.getItem("inventory")
    ) || [];


// =====================================
// GET ITEM CODE FROM URL
// =====================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const itemCode =
    urlParams.get("itemCode");


// =====================================
// GET HTML ELEMENTS
// =====================================

const stockInItemCode =
    document.getElementById("stockInItemCode");

const stockInCategory =
    document.getElementById("stockInCategory");

const stockInItemType =
    document.getElementById("stockInItemType");

const stockInDescription =
    document.getElementById("stockInDescription");

const stockInCurrentStock =
    document.getElementById("stockInCurrentStock");

const stockInSellingPrice =
    document.getElementById("stockInSellingPrice");

const stockInQuantity =
    document.getElementById("stockInQuantity");

const currency =
    document.getElementById("currency");

const totalPrice =
    document.getElementById("totalPrice");

const stockInForm =
    document.getElementById("stockInForm");

const stockInResult =
    document.getElementById("stockInResult");


// =====================================
// SUCCESS MODAL ELEMENTS
// =====================================

const stockInSuccessModal =
    document.getElementById(
        "stockInSuccessModal"
    );

const stockInSuccessMessage =
    document.getElementById(
        "stockInSuccessMessage"
    );

const stockInSuccessDetails =
    document.getElementById(
        "stockInSuccessDetails"
    );


// =====================================
// FIND SELECTED PRODUCT
// =====================================

let selectedProduct =
    inventory.find(
        function (product) {

            return (
                String(product.itemCode).trim() ===
                String(itemCode).trim()
            );

        }
    );


// =====================================
// CHECK PRODUCT
// =====================================

if (!selectedProduct) {

    stockInResult.className =
        "alert alert-danger mb-4";

    stockInResult.classList.remove(
        "d-none"
    );

    stockInResult.innerHTML = `

        <i
            class="bi bi-exclamation-triangle-fill me-2"
        ></i>

        <strong>Product not found.</strong>

        Please return to the Products page
        and select a product again.

    `;

    stockInForm.style.display =
        "none";

}


// =====================================
// DISPLAY SELECTED PRODUCT
// =====================================

else {

    stockInItemCode.value =
        selectedProduct.itemCode || "";

    stockInCategory.value =
        selectedProduct.category || "";

    stockInItemType.value =
        selectedProduct.itemType || "";

    stockInDescription.value =
        selectedProduct.itemDescription || "";

    stockInCurrentStock.value =
        Number(
            selectedProduct.stockQuantity
        ) || 0;

    stockInSellingPrice.value =
        "₦" +
        Number(
            selectedProduct.sellingPrice
        ).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =====================================
// CALCULATE TOTAL PRICE
// =====================================

function calculateTotalPrice() {

    if (!selectedProduct) {
        return;
    }


    const quantity =
        Number(
            stockInQuantity.value
        ) || 0;


    const price =
        Number(
            selectedProduct.sellingPrice
        ) || 0;


    const total =
        quantity * price;


    totalPrice.textContent =
        currency.value +
        total.toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =====================================
// QUANTITY EVENT
// =====================================

stockInQuantity.addEventListener(
    "input",
    calculateTotalPrice
);


// =====================================
// CURRENCY EVENT
// =====================================

currency.addEventListener(
    "change",
    calculateTotalPrice
);


// =====================================
// STOCK-IN SUBMISSION
// =====================================

stockInForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // =====================================
        // CHECK PRODUCT
        // =====================================

        if (!selectedProduct) {

            alert(
                "Product not found."
            );

            return;

        }


        // =====================================
        // GET QUANTITY
        // =====================================

        const quantity =
            Number(
                stockInQuantity.value
            );


        // =====================================
        // VALIDATE QUANTITY
        // =====================================

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            alert(
                "Please enter a valid quantity."
            );

            return;

        }


        // =====================================
        // GET CURRENT STOCK
        // =====================================

        const currentStock =
            Number(
                selectedProduct.stockQuantity
            ) || 0;


        // =====================================
        // CALCULATE NEW STOCK
        // =====================================

        const newStock =
            currentStock + quantity;


        // =====================================
        // UPDATE PRODUCT STOCK
        // =====================================

        selectedProduct.stockQuantity =
            newStock;


        // =====================================
        // SAVE INVENTORY
        // =====================================

        localStorage.setItem(
            "inventory",
            JSON.stringify(
                inventory
            )
        );


        // =====================================
        // GET STOCK-IN HISTORY
        // =====================================

        let stockInHistory =
            JSON.parse(
                localStorage.getItem(
                    "stockInHistory"
                )
            ) || [];


        // =====================================
        // GET SELLING PRICE
        // =====================================

        const price =
            Number(
                selectedProduct.sellingPrice
            ) || 0;


        // =====================================
        // CALCULATE TOTAL
        // =====================================

        const total =
            quantity * price;


        // =====================================
        // SAVE STOCK-IN TRANSACTION
        // =====================================

        stockInHistory.push({

            itemCode:
                selectedProduct.itemCode,

            itemType:
                selectedProduct.itemType,

            category:
                selectedProduct.category,

            quantity:
                quantity,

            previousStock:
                currentStock,

            newStock:
                newStock,

            sellingPrice:
                price,

            currency:
                currency.value,

            totalPrice:
                total,

            date:
                new Date().toLocaleString()

        });


        // =====================================
        // SAVE HISTORY
        // =====================================

        localStorage.setItem(
            "stockInHistory",
            JSON.stringify(
                stockInHistory
            )
        );


        // =====================================
        // UPDATE CURRENT STOCK
        // =====================================

        stockInCurrentStock.value =
            newStock;


        // =====================================
        // PREPARE SUCCESS MODAL
        // =====================================

        stockInSuccessMessage.textContent =
            `${quantity} unit(s) of ${selectedProduct.itemType} have been added successfully.`;


        stockInSuccessDetails.innerHTML = `

            <div class="mb-2">

                <strong>Item Code:</strong>

                ${selectedProduct.itemCode}

            </div>


            <div class="mb-2">

                <strong>Previous Stock:</strong>

                ${currentStock}

            </div>


            <div class="mb-2">

                <strong>Quantity Added:</strong>

                ${quantity}

            </div>


            <div class="mb-2">

                <strong>New Stock:</strong>

                ${newStock}

            </div>


            <div>

                <strong>Total Value:</strong>

                ${currency.value}${total.toLocaleString(
                    "en-NG",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}

            </div>

        `;


        // =====================================
        // HIDE OLD ALERT
        // =====================================

        stockInResult.classList.add(
            "d-none"
        );


        // =====================================
        // SHOW SUCCESS MODAL
        // =====================================

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                stockInSuccessModal
            );

        modal.show();


        // =====================================
        // CLEAR QUANTITY
        // =====================================

        stockInQuantity.value = "";


        // =====================================
        // RESET TOTAL
        // =====================================

        totalPrice.textContent =
            currency.value +
            "0.00";


        // =====================================
        // LOG SUCCESS
        // =====================================

        console.log(
            "Stock-In successful:",
            selectedProduct
        );

    }
);


// =====================================
// INITIAL TOTAL
// =====================================

calculateTotalPrice();
