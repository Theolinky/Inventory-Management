
// =====================================
// STOCK OUT
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

const stockOutItemCode =
    document.getElementById(
        "stockOutItemCode"
    );

const stockOutCategory =
    document.getElementById(
        "stockOutCategory"
    );

const stockOutItemType =
    document.getElementById(
        "stockOutItemType"
    );

const stockOutDescription =
    document.getElementById(
        "stockOutDescription"
    );

const stockOutCurrentStock =
    document.getElementById(
        "stockOutCurrentStock"
    );

const stockOutSellingPrice =
    document.getElementById(
        "stockOutSellingPrice"
    );

const stockOutCurrency =
    document.getElementById(
        "stockOutCurrency"
    );

const stockOutQuantity =
    document.getElementById(
        "stockOutQuantity"
    );

const stockOutTotalPrice =
    document.getElementById(
        "stockOutTotalPrice"
    );

const stockOutForm =
    document.getElementById(
        "stockOutForm"
    );

const stockOutResult =
    document.getElementById(
        "stockOutResult"
    );


// =====================================
// SUCCESS MODAL ELEMENTS
// =====================================

const stockOutSuccessModal =
    document.getElementById(
        "stockOutSuccessModal"
    );

const stockOutSuccessMessage =
    document.getElementById(
        "stockOutSuccessMessage"
    );

const stockOutSuccessDetails =
    document.getElementById(
        "stockOutSuccessDetails"
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

    stockOutResult.className =
        "alert alert-danger mb-4";

    stockOutResult.classList.remove(
        "d-none"
    );

    stockOutResult.innerHTML = `

        <i
            class="bi bi-exclamation-triangle-fill me-2"
        ></i>

        <strong>Product not found.</strong>

        Please return to the Products page
        and select a product again.

    `;

    stockOutForm.style.display =
        "none";

}


// =====================================
// DISPLAY SELECTED PRODUCT
// =====================================

else {

    stockOutItemCode.value =
        selectedProduct.itemCode || "";

    stockOutCategory.value =
        selectedProduct.category || "";

    stockOutItemType.value =
        selectedProduct.itemType || "";

    stockOutDescription.value =
        selectedProduct.itemDescription || "";

    stockOutCurrentStock.value =
        Number(
            selectedProduct.stockQuantity
        ) || 0;

    stockOutSellingPrice.value =
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
// CALCULATE TOTAL VALUE
// =====================================

function calculateTotalPrice() {

    if (!selectedProduct) {
        return;
    }


    const quantity =
        Number(
            stockOutQuantity.value
        ) || 0;


    const price =
        Number(
            selectedProduct.sellingPrice
        ) || 0;


    const total =
        quantity * price;


    stockOutTotalPrice.textContent =
        stockOutCurrency.value +
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

stockOutQuantity.addEventListener(
    "input",
    calculateTotalPrice
);


// =====================================
// CURRENCY EVENT
// =====================================

stockOutCurrency.addEventListener(
    "change",
    calculateTotalPrice
);


// =====================================
// STOCK OUT FORM
// =====================================

stockOutForm.addEventListener(
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
                stockOutQuantity.value
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
        // CHECK AVAILABLE STOCK
        // =====================================

        if (quantity > currentStock) {

            alert(
                `You cannot remove ${quantity} unit(s). Only ${currentStock} unit(s) are available.`
            );

            return;

        }


        // =====================================
        // CALCULATE NEW STOCK
        // =====================================

        const newStock =
            currentStock - quantity;


        // =====================================
        // UPDATE INVENTORY
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
        // GET STOCK-OUT HISTORY
        // =====================================

        let stockOutHistory =
            JSON.parse(
                localStorage.getItem(
                    "stockOutHistory"
                )
            ) || [];


        // =====================================
        // GET PRICE
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
        // SAVE STOCK-OUT TRANSACTION
        // =====================================

        stockOutHistory.push({

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
                stockOutCurrency.value,

            totalPrice:
                total,

            date:
                new Date().toLocaleString()

        });


        // =====================================
        // SAVE HISTORY
        // =====================================

        localStorage.setItem(
            "stockOutHistory",
            JSON.stringify(
                stockOutHistory
            )
        );


        // =====================================
        // UPDATE CURRENT STOCK
        // =====================================

        stockOutCurrentStock.value =
            newStock;


        // =====================================
        // SHOW SUCCESS MODAL
        // =====================================

        stockOutSuccessMessage.textContent =
            `${quantity} unit(s) of ${selectedProduct.itemType} have been removed successfully.`;


        stockOutSuccessDetails.innerHTML = `

            <div class="mb-2">

                <strong>Item Code:</strong>

                ${selectedProduct.itemCode}

            </div>


            <div class="mb-2">

                <strong>Previous Stock:</strong>

                ${currentStock}

            </div>


            <div class="mb-2">

                <strong>Quantity Removed:</strong>

                ${quantity}

            </div>


            <div class="mb-2">

                <strong>New Stock:</strong>

                ${newStock}

            </div>


            <div>

                <strong>Total Value:</strong>

                ${stockOutCurrency.value}${total.toLocaleString(
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

        stockOutResult.classList.add(
            "d-none"
        );


        // =====================================
        // SHOW BOOTSTRAP MODAL
        // =====================================

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                stockOutSuccessModal
            );

        modal.show();


        // =====================================
        // CLEAR QUANTITY
        // =====================================

        stockOutQuantity.value =
            "";


        // =====================================
        // RESET TOTAL
        // =====================================

        stockOutTotalPrice.textContent =
            stockOutCurrency.value +
            "0.00";


        // =====================================
        // LOG
        // =====================================

        console.log(
            "Stock-Out successful:",
            selectedProduct
        );

    }
);


// =====================================
// INITIAL TOTAL
// =====================================

calculateTotalPrice();

