// =====================================
// INVENTORY MANAGEMENT SYSTEM
// APP.JS
// =====================================


// =====================================
// GET INVENTORY FROM LOCAL STORAGE
// =====================================

let inventory = JSON.parse(
    localStorage.getItem("inventory")
) || [];


// =====================================
// GET FORM
// =====================================

const itemForm = document.getElementById("itemForm");


// =====================================
// GET ITEM CODE INPUT
// =====================================

const itemCodeInput = document.getElementById("itemCode");


// =====================================
// CHECK THAT FORM EXISTS
// =====================================

if (itemForm && itemCodeInput) {

    // =====================================
    // GENERATE NEXT ITEM CODE
    // =====================================

    let nextItemNumber = 1;

    if (inventory.length > 0) {

        const itemNumbers = inventory
            .map(function (product) {

                const code = String(
                    product.itemCode || ""
                ).replace("ITM", "");

                return Number(code);
            })
            .filter(function (number) {

                return !isNaN(number);
            });


        if (itemNumbers.length > 0) {

            nextItemNumber =
                Math.max(...itemNumbers) + 1;
        }
    }


    // =====================================
    // DISPLAY ITEM CODE
    // =====================================

    itemCodeInput.value =
        "ITM" +
        String(nextItemNumber).padStart(3, "0");


    // =====================================
    // REGISTER ITEM
    // =====================================

    itemForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =====================================
            // GET FORM VALUES
            // =====================================

            const category =
                document.getElementById("category").value;

            const itemType =
                document
                    .getElementById("itemType")
                    .value
                    .trim();

            const itemDescription =
                document
                    .getElementById("itemDescription")
                    .value
                    .trim();

            const costPrice =
                Number(
                    document.getElementById("costPrice").value
                );

            const sellingPrice =
                Number(
                    document.getElementById("sellingPrice").value
                );

            const stockQuantity =
                Number(
                    document.getElementById("stockQuantity").value
                );

            const reorderLevel =
                Number(
                    document.getElementById("reorderLevel").value
                );


            // =====================================
            // PRICE VALIDATION
            // =====================================

            if (sellingPrice < costPrice) {

                alert(
                    "Selling price cannot be lower than cost price."
                );

                return;
            }


            // =====================================
            // CREATE PRODUCT
            // =====================================

            const product = {

                itemCode: itemCodeInput.value,

                category: category,

                itemType: itemType,

                itemDescription: itemDescription,

                costPrice: costPrice,

                sellingPrice: sellingPrice,

                stockQuantity: stockQuantity,

                reorderLevel: reorderLevel

            };


            // =====================================
            // ADD PRODUCT TO INVENTORY
            // =====================================

            inventory.push(product);


            // =====================================
            // SAVE TO LOCAL STORAGE
            // =====================================

            localStorage.setItem(
                "inventory",
                JSON.stringify(inventory)
            );


            // =====================================
            // CHECK SAVE
            // =====================================

            console.log(
                "Product successfully saved:",
                product
            );

            console.log(
                "Current inventory:",
                inventory
            );


            // =====================================
            // SHOW SUCCESS MODAL
            // =====================================

            const successModalElement =
                document.getElementById("successModal");


            if (successModalElement) {

                const successModal =
                    new bootstrap.Modal(
                        successModalElement
                    );

                successModal.show();


                // =====================================
                // CONTINUE BUTTON
                // =====================================

                const successContinueBtn =
                    document.getElementById(
                        "successContinueBtn"
                    );


                if (successContinueBtn) {

                    successContinueBtn.onclick =
                        function () {

                            window.location.href =
                                "products.html";
                        };
                }

            }

            else {

                // Fallback if modal is not yet added
                window.location.href =
                    "products.html";
            }

        }
    );

}

// =====================================
// CATEGORY AND ITEM TYPE
// =====================================

const category =
    document.getElementById("category");

const itemType =
    document.getElementById("itemType");


// =====================================
// ITEM TYPES BY CATEGORY
// =====================================

const itemTypes = {

    Food: [
        "Rice",
        "Beans",
        "Garri",
        "Spaghetti",
        "Yam",
        "Potato"
    ],

    Beverages: [
        "Coca-Cola",
        "Pepsi",
        "Water",
        "Juice",
        "Malt",
        "Energy Drink"
    ],

    Dairy: [
        "Milk",
        "Yoghurt",
        "Cheese",
        "Butter",
        "Cream"
    ],

    Household: [
        "Soap",
        "Detergent",
        "Tissue",
        "Toothpaste",
        "Bleach"
    ],

    Snacks: [
        "Biscuit",
        "Chips",
        "Popcorn",
        "Chocolate",
        "Cookies"
    ]

};


// =====================================
// CATEGORY CHANGE
// =====================================

category.addEventListener(
    "change",
    function () {

        // Clear existing options

        itemType.innerHTML = `
            <option value="" selected disabled>
                Select item type
            </option>
        `;


        // Get selected category

        const selectedCategory =
            category.value;


        // Get item types

        const types =
            itemTypes[selectedCategory] || [];


        // Add item types

        types.forEach(
            function (type) {

                const option =
                    document.createElement("option");

                option.value = type;

                option.textContent = type;

                itemType.appendChild(option);

            }
        );

    }
);