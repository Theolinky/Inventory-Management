// =====================================
// GET INVENTORY
// =====================================

const inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];


// =====================================
// GET DASHBOARD ELEMENTS
// =====================================

const totalProducts =
    document.getElementById("totalProducts");

const totalCategories =
    document.getElementById("totalCategories");

const totalStock =
    document.getElementById("totalStock");

const outOfStock =
    document.getElementById("outOfStock");

const totalStockIn =
    document.getElementById("totalStockIn");

const totalStockOut =
    document.getElementById("totalStockOut");

const lowStock =
    document.getElementById("lowStock");

const lowStockTableBody =
    document.getElementById("lowStockTableBody");

const outOfStockTableBody =
    document.getElementById("outOfStockTableBody");


// =====================================
// TOTAL PRODUCTS
// =====================================

totalProducts.textContent =
    inventory.length;


// =====================================
// TOTAL CATEGORIES
// =====================================

const categories = [
    ...new Set(
        inventory
            .map(function (product) {
                return product.category;
            })
            .filter(function (category) {
                return category;
            })
    )
];

totalCategories.textContent =
    categories.length;


// =====================================
// TOTAL STOCK
// =====================================

let stockTotal = 0;

inventory.forEach(function (product) {

    const quantity =
        Number(product.stockQuantity) || 0;

    stockTotal += quantity;

});

totalStock.textContent =
    stockTotal;


// =====================================
// OUT OF STOCK PRODUCTS
// =====================================

const outOfStockProducts =
    inventory.filter(function (product) {

        const quantity =
            Number(product.stockQuantity) || 0;

        return quantity === 0;

    });

outOfStock.textContent =
    outOfStockProducts.length;


// =====================================
// LOW STOCK PRODUCTS
// =====================================

const lowStockProducts =
    inventory.filter(function (product) {

        const quantity =
            Number(product.stockQuantity) || 0;

        const reorderLevel =
            Number(product.reorderLevel) || 0;

        // Low stock must be greater than 0
        // and less than or equal to reorder level

        return (
            quantity > 0 &&
            quantity <= reorderLevel
        );

    });

lowStock.textContent =
    lowStockProducts.length;


// =====================================
// STOCK IN HISTORY
// =====================================

const stockInHistory =
    JSON.parse(
        localStorage.getItem("stockInHistory")
    ) || [];

let stockInTotal = 0;

stockInHistory.forEach(function (transaction) {

    const quantity =
        Number(transaction.quantity) || 0;

    stockInTotal += quantity;

});

totalStockIn.textContent =
    stockInTotal;


// =====================================
// STOCK OUT HISTORY
// =====================================

const stockOutHistory =
    JSON.parse(
        localStorage.getItem("stockOutHistory")
    ) || [];

let stockOutTotal = 0;

stockOutHistory.forEach(function (transaction) {

    const quantity =
        Number(transaction.quantity) || 0;

    stockOutTotal += quantity;

});

totalStockOut.textContent =
    stockOutTotal;


// =====================================
// LOW STOCK TABLE
// =====================================

if (lowStockProducts.length === 0) {

    lowStockTableBody.innerHTML = `
        <tr>

            <td
                colspan="7"
                class="text-center text-muted py-4"
            >

                <i class="bi bi-check-circle-fill text-success fs-3"></i>

                <p class="mt-2 mb-0">
                    No low stock items.
                </p>

            </td>

        </tr>
    `;

} else {

    lowStockProducts.forEach(function (product, index) {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${product.itemCode || "N/A"}
            </td>

            <td>
                ${product.itemType || "N/A"}
            </td>

            <td>
                ${product.category || "N/A"}
            </td>

            <td>
                ${Number(product.stockQuantity) || 0}
            </td>

            <td>
                ${Number(product.reorderLevel) || 0}
            </td>

            <td>
                <span class="badge bg-warning text-dark">
                    Low Stock
                </span>
            </td>

        `;

        lowStockTableBody.appendChild(row);

    });

}


// =====================================
// OUT OF STOCK TABLE
// =====================================

if (outOfStockTableBody) {

    if (outOfStockProducts.length === 0) {

        outOfStockTableBody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="text-center text-muted py-4"
                >

                    <i class="bi bi-box-seam fs-3"></i>

                    <p class="mt-2 mb-0">
                        No out-of-stock items.
                    </p>

                </td>

            </tr>
        `;

    } else {

        outOfStockProducts.forEach(function (product, index) {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${product.itemCode || "N/A"}
                </td>

                <td>
                    ${product.itemType || "N/A"}
                </td>

                <td>
                    ${product.category || "N/A"}
                </td>

                <td>
                    <strong class="text-danger">
                        0
                    </strong>
                </td>

                <td>
                    ${Number(product.reorderLevel) || 0}
                </td>

                <td>
                    <span class="badge bg-danger">
                        Out of Stock
                    </span>
                </td>

            `;

            outOfStockTableBody.appendChild(row);

        });

    }

}


// =====================================
// CLEAR ALL PRODUCTS
// =====================================

const confirmClearAllProducts =
    document.getElementById(
        "confirmClearAllProducts"
    );

if (confirmClearAllProducts) {

    confirmClearAllProducts.addEventListener(
        "click",
        function () {

            // Remove all products
            localStorage.removeItem(
                "inventory"
            );

            // Remove stock-in history
            localStorage.removeItem(
                "stockInHistory"
            );

            // Remove stock-out history
            localStorage.removeItem(
                "stockOutHistory"
            );

            // Close modal
            const modalElement =
                document.getElementById(
                    "clearAllProductsModal"
                );

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );

            if (modal) {
                modal.hide();
            }

            // Reload dashboard
            setTimeout(
                function () {

                    location.reload();

                },
                300
            );

        }
    );

}