// =====================================
// GET INVENTORY
// =====================================

const inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];


// =====================================
// ELEMENTS
// =====================================

const productTableBody =
    document.getElementById("productTableBody");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const lowStockAlert =
    document.getElementById("lowStockAlert");


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts(products) {

    productTableBody.innerHTML = "";


    if (products.length === 0) {

        productTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="text-center text-muted py-4"
                >

                    <i class="bi bi-box-seam fs-2"></i>

                    <p class="mt-2 mb-0">
                        No products found.
                    </p>

                </td>

            </tr>

        `;

        return;

    }


    products.forEach(function (product) {

        const originalIndex =
            inventory.indexOf(product);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${product.itemCode}
            </td>

            <td>
                ${product.category}
            </td>

            <td>
                ${product.itemType}
            </td>

            <td>
                ${product.itemDescription}
            </td>

            <td>
                ₦${Number(product.costPrice).toLocaleString()}
            </td>

            <td>
                ₦${Number(product.sellingPrice).toLocaleString()}
            </td>

            <td>
                ${product.stockQuantity}
            </td>

            <td>
                ${product.reorderLevel}
            </td>

            <td>

                ${
                    Number(product.stockQuantity) === 0

                    ?

                    '<span class="badge bg-danger">Out of Stock</span>'

                    :

                    Number(product.stockQuantity)
                    <=
                    Number(product.reorderLevel)

                    ?

                    '<span class="badge bg-warning text-dark">Low Stock</span>'

                    :

                    '<span class="badge bg-success">In Stock</span>'
                }

            </td>

            <td>

                <div class="btn-group">

                    <button
                        class="btn btn-sm btn-success"
                        onclick="stockIn(${originalIndex})"
                    >

                        <i class="bi bi-plus"></i>

                    </button>


                    <button
                        class="btn btn-sm btn-danger"
                        onclick="stockOut(${originalIndex})"
                    >

                        <i class="bi bi-dash"></i>

                    </button>

                </div>

            </td>

        `;


        productTableBody.appendChild(row);

    });

}


// =====================================
// FILTER PRODUCTS
// =====================================

function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const filteredProducts =
        inventory.filter(function (product) {


            const matchesSearch =

                product.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                product.itemType
                    .toLowerCase()
                    .includes(searchText)

                ||

                product.itemDescription
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                selectedCategory === "all"

                ||

                product.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayProducts(filteredProducts);

}


// =====================================
// LOW STOCK ALERT
// =====================================

function showLowStockAlert() {

    const lowStockProducts =
        inventory.filter(function (product) {

            return (
                Number(product.stockQuantity)
                <=
                Number(product.reorderLevel)
            );

        });


    if (lowStockProducts.length === 0) {

        lowStockAlert.classList.add("d-none");

        return;

    }


    lowStockAlert.classList.remove("d-none");


    lowStockAlert.innerHTML = `

        <i class="bi bi-exclamation-triangle me-2"></i>

        <strong>Low Stock Alert!</strong>

        ${lowStockProducts.length}

        item(s) need attention.

    `;

}


// =====================================
// STOCK IN
// =====================================

function stockIn(index) {

    const quantity =
        Number(
            prompt("Enter quantity to add:")
        );


    if (
        quantity <= 0 ||
        isNaN(quantity)
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    inventory[index].stockQuantity =

        Number(
            inventory[index].stockQuantity
        )

        +

        quantity;


    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );


    const stockInHistory =
        JSON.parse(
            localStorage.getItem("stockInHistory")
        ) || [];


    stockInHistory.push({

        itemCode:
            inventory[index].itemCode,

        itemType:
            inventory[index].itemType,

        quantity:
            quantity,

        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(
        "stockInHistory",
        JSON.stringify(stockInHistory)
    );


    alert(
        "Stock added successfully."
    );


    displayProducts(inventory);

    showLowStockAlert();

}


// =====================================
// STOCK OUT
// =====================================

function stockOut(index) {

    const quantity =
        Number(
            prompt("Enter quantity to remove:")
        );


    if (
        quantity <= 0 ||
        isNaN(quantity)
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    const currentStock =
        Number(
            inventory[index].stockQuantity
        );


    if (quantity > currentStock) {

        alert(
            "You cannot remove more stock than available."
        );

        return;

    }


    inventory[index].stockQuantity =

        currentStock - quantity;


    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );


    const stockOutHistory =
        JSON.parse(
            localStorage.getItem("stockOutHistory")
        ) || [];


    stockOutHistory.push({

        itemCode:
            inventory[index].itemCode,

        itemType:
            inventory[index].itemType,

        quantity:
            quantity,

        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(
        "stockOutHistory",
        JSON.stringify(stockOutHistory)
    );


    alert(
        "Stock removed successfully."
    );


    displayProducts(inventory);

    showLowStockAlert();

}


// =====================================
// EVENTS
// =====================================

searchInput.addEventListener(
    "input",
    filterProducts
);


categoryFilter.addEventListener(
    "change",
    filterProducts
);


// =====================================
// INITIAL DISPLAY
// =====================================

displayProducts(inventory);

showLowStockAlert();