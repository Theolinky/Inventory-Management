
// =====================================
// INVENTORY MANAGEMENT SYSTEM
// PRODUCTS.JS
// =====================================


// =====================================
// GET INVENTORY FROM LOCAL STORAGE
// =====================================

let inventory =
    JSON.parse(
        localStorage.getItem("inventory")
    ) || [];


// =====================================
// PRODUCT ELEMENTS
// =====================================

const productTableBody =
    document.getElementById("productTableBody");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const lowStockAlert =
    document.getElementById("lowStockAlert");

const pagination =
    document.getElementById("pagination");

const paginationInfo =
    document.getElementById("paginationInfo");


// =====================================
// PAGINATION SETTINGS
// =====================================

const productsPerPage = 5;

let currentPage = 1;

let filteredProducts =
    [...inventory];


// =====================================
// LOAD INVENTORY
// =====================================

function loadInventory() {

    inventory =
        JSON.parse(
            localStorage.getItem("inventory")
        ) || [];

    filteredProducts =
        [...inventory];
}


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts(products) {

    productTableBody.innerHTML = "";


    // =====================================
    // PAGINATION
    // =====================================

    const start =
        (currentPage - 1) *
        productsPerPage;

    const end =
        start + productsPerPage;

    const pageProducts =
        products.slice(start, end);


    // =====================================
    // NO PRODUCTS
    // =====================================

    if (pageProducts.length === 0) {

        productTableBody.innerHTML = `
            <tr>

                <td
                    colspan="11"
                    class="text-center text-muted py-5"
                >

                    <i
                        class="bi bi-box-seam fs-1"
                    ></i>

                    <p class="mt-3 mb-0">
                        No products found.
                    </p>

                </td>

            </tr>
        `;

        updatePagination(products);

        return;
    }


    // =====================================
    // DISPLAY PRODUCTS
    // =====================================

    pageProducts.forEach(
        function(product, index) {

            const row =
                document.createElement("tr");


            // =====================================
            // PRODUCT STATUS
            // =====================================

            const quantity =
                Number(
                    product.stockQuantity
                ) || 0;

            const reorderLevel =
                Number(
                    product.reorderLevel
                ) || 0;


            let status = "";


            if (quantity === 0) {

                status = `
                    <span class="badge bg-danger">
                        Out of Stock
                    </span>
                `;

            }

            else if (
                quantity <= reorderLevel
            ) {

                status = `
                    <span class="badge bg-warning text-dark">
                        Low Stock
                    </span>
                `;

            }

            else {

                status = `
                    <span class="badge bg-success">
                        In Stock
                    </span>
                `;

            }


            // =====================================
            // PRODUCT ROW
            // =====================================

            row.innerHTML = `

                <!-- NUMBER -->

                <td>
                    ${
                        (currentPage - 1) *
                        productsPerPage +
                        index +
                        1
                    }
                </td>


                <!-- ITEM CODE -->

                <td>
                    ${
                        product.itemCode ||
                        "N/A"
                    }
                </td>


                <!-- CATEGORY -->

                <td>
                    ${
                        product.category ||
                        "N/A"
                    }
                </td>


                <!-- ITEM TYPE -->

                <td>
                    ${
                        product.itemType ||
                        "N/A"
                    }
                </td>


                <!-- DESCRIPTION -->

                <td>
                    ${
                        product.itemDescription ||
                        "N/A"
                    }
                </td>


                <!-- COST PRICE -->

                <td>
                    ₦${
                        Number(
                            product.costPrice || 0
                        ).toLocaleString()
                    }
                </td>


                <!-- SELLING PRICE -->

                <td>
                    ₦${
                        Number(
                            product.sellingPrice || 0
                        ).toLocaleString()
                    }
                </td>


                <!-- STOCK -->

                <td>
                    ${quantity}
                </td>


                <!-- REORDER LEVEL -->

                <td>
                    ${reorderLevel}
                </td>


                <!-- STATUS -->

                <td>
                    ${status}
                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="d-flex gap-1">


                        <!-- STOCK IN -->

                        <button
                            class="btn btn-success btn-sm"
                            onclick="goToStockIn('${product.itemCode}')"
                            title="Stock In"
                        >

                            <i
                                class="bi bi-box-arrow-in-down"
                            ></i>

                        </button>


                        <!-- STOCK OUT -->

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="goToStockOut('${product.itemCode}')"
                            title="Stock Out"
                        >

                            <i
                                class="bi bi-box-arrow-up"
                            ></i>

                        </button>


                        <!-- DELETE -->

                        <button
                            class="btn btn-outline-danger btn-sm"
                            onclick="openDeleteModal('${product.itemCode}')"
                            title="Delete Product"
                        >

                            <i
                                class="bi bi-trash"
                            ></i>

                        </button>


                    </div>

                </td>

            `;


            productTableBody.appendChild(row);

        }
    );


    // =====================================
    // UPDATE PAGINATION
    // =====================================

    updatePagination(products);

}


// =====================================
// DELETE VARIABLES
// =====================================

let productToDelete = null;


const deleteProductModalElement =
    document.getElementById(
        "deleteProductModal"
    );


const deleteProductName =
    document.getElementById(
        "deleteProductName"
    );


const deleteProductCode =
    document.getElementById(
        "deleteProductCode"
    );


const confirmDeleteBtn =
    document.getElementById(
        "confirmDeleteBtn"
    );


// =====================================
// OPEN DELETE MODAL
// =====================================

function openDeleteModal(itemCode) {

    const product =
        inventory.find(
            function(product) {

                return (
                    product.itemCode ===
                    itemCode
                );

            }
        );


    if (!product) {

        console.error(
            "Product not found:",
            itemCode
        );

        return;
    }


    productToDelete =
        product;


    deleteProductName.textContent =
        product.itemType ||
        "Unknown Product";


    deleteProductCode.textContent =
        "Item Code: " +
        product.itemCode;


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            deleteProductModalElement
        );


    modal.show();

}


// =====================================
// CONFIRM DELETE
// =====================================

if (confirmDeleteBtn) {

    confirmDeleteBtn.addEventListener(
        "click",
        function() {

            if (!productToDelete) {
                return;
            }


            const itemCode =
                productToDelete.itemCode;


            // =====================================
            // REMOVE PRODUCT
            // =====================================

            inventory =
                inventory.filter(
                    function(product) {

                        return (
                            product.itemCode !==
                            itemCode
                        );

                    }
                );


            // =====================================
            // SAVE INVENTORY
            // =====================================

            localStorage.setItem(
                "inventory",
                JSON.stringify(inventory)
            );


            // =====================================
            // UPDATE ARRAY
            // =====================================

            filteredProducts =
                [...inventory];


            // =====================================
            // CLOSE MODAL
            // =====================================

            const modal =
                bootstrap.Modal.getInstance(
                    deleteProductModalElement
                );


            if (modal) {
                modal.hide();
            }


            // =====================================
            // RESET
            // =====================================

            productToDelete =
                null;

            currentPage =
                1;


            // =====================================
            // REFRESH PRODUCTS
            // =====================================

            displayProducts(
                filteredProducts
            );

            showLowStockAlert();

        }
    );

}


// =====================================
// FILTER PRODUCTS
// =====================================

function filterProducts() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    filteredProducts =
        inventory.filter(
            function(product) {


                const matchesSearch =

                    (
                        product.itemCode ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (
                        product.category ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (
                        product.itemType ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (
                        product.itemDescription ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =

                    selectedCategory === "all"

                    ||

                    product.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    // =====================================
    // RETURN TO FIRST PAGE
    // =====================================

    currentPage = 1;


    displayProducts(
        filteredProducts
    );

}


// =====================================
// PAGINATION
// =====================================

function updatePagination(products) {

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            products.length /
            productsPerPage
        );


    // =====================================
    // PAGINATION INFORMATION
    // =====================================

    if (products.length === 0) {

        paginationInfo.textContent =
            "Showing 0 products";

    }

    else {

        const start =
            (currentPage - 1) *
            productsPerPage +
            1;


        const end =
            Math.min(
                currentPage *
                productsPerPage,
                products.length
            );


        paginationInfo.textContent =
            `Showing ${start}-${end} of ${products.length} products`;

    }


    // =====================================
    // ONLY ONE PAGE
    // =====================================

    if (totalPages <= 1) {
        return;
    }


    // =====================================
    // PREVIOUS
    // =====================================

    const previous =
        document.createElement("li");


    previous.className =
        `page-item ${
            currentPage === 1
                ? "disabled"
                : ""
        }`;


    previous.innerHTML = `
        <button class="page-link">
            Previous
        </button>
    `;


    previous.addEventListener(
        "click",
        function() {

            if (currentPage > 1) {

                currentPage--;

                displayProducts(
                    filteredProducts
                );

            }

        }
    );


    pagination.appendChild(
        previous
    );


    // =====================================
    // PAGE NUMBERS
    // =====================================

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageItem =
            document.createElement("li");


        pageItem.className =
            `page-item ${
                page === currentPage
                    ? "active"
                    : ""
            }`;


        pageItem.innerHTML = `
            <button class="page-link">
                ${page}
            </button>
        `;


        pageItem.addEventListener(
            "click",
            function() {

                currentPage =
                    page;

                displayProducts(
                    filteredProducts
                );

            }
        );


        pagination.appendChild(
            pageItem
        );

    }


    // =====================================
    // NEXT
    // =====================================

    const next =
        document.createElement("li");


    next.className =
        `page-item ${
            currentPage === totalPages
                ? "disabled"
                : ""
        }`;


    next.innerHTML = `
        <button class="page-link">
            Next
        </button>
    `;


    next.addEventListener(
        "click",
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayProducts(
                    filteredProducts
                );

            }

        }
    );


    pagination.appendChild(
        next
    );

}


// =====================================
// LOW STOCK ALERT
// =====================================

function showLowStockAlert() {

    const lowStockProducts =
        inventory.filter(
            function(product) {

                return (
                    Number(
                        product.stockQuantity
                    ) <=
                    Number(
                        product.reorderLevel
                    )
                );

            }
        );


    if (
        lowStockProducts.length === 0
    ) {

        lowStockAlert.classList.add(
            "d-none"
        );

        return;
    }


    lowStockAlert.classList.remove(
        "d-none"
    );


    lowStockAlert.innerHTML = `

        <i
            class="bi bi-exclamation-triangle-fill me-2"
        ></i>

        <strong>
            Low Stock Alert!
        </strong>

        ${lowStockProducts.length}
        item(s) need attention.

    `;

}


// =====================================
// GO TO STOCK-IN
// =====================================

function goToStockIn(itemCode) {

    window.location.href =
        `stock-in.html?itemCode=${encodeURIComponent(itemCode)}`;

}


// =====================================
// GO TO STOCK-OUT
// =====================================

function goToStockOut(itemCode) {

    window.location.href =
        `stock-out.html?itemCode=${encodeURIComponent(itemCode)}`;

}


// =====================================
// SEARCH EVENT
// =====================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


// =====================================
// CATEGORY EVENT
// =====================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


// =====================================
// INITIAL LOAD
// =====================================

loadInventory();

displayProducts(
    filteredProducts
);

showLowStockAlert();

