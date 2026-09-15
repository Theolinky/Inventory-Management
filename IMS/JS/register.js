// =====================================
// GET INVENTORY
// =====================================

let inventory =
    JSON.parse(
        localStorage.getItem("inventory")
    ) || [];


// =====================================
// GET FORM ELEMENTS
// =====================================

const itemCodeInput =
    document.getElementById("itemCode");

const itemForm =
    document.getElementById("itemForm");


// =====================================
// GENERATE NEXT ITEM CODE
// =====================================

let nextItemNumber = 1;

if (inventory.length > 0) {

    const itemNumbers =
        inventory
            .map(function (product) {

                const code =
                    String(
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
        // GET VALUES
        // =====================================

        const category =
            document.getElementById(
                "category"
            ).value;


        const itemType =
            document.getElementById(
                "itemType"
            ).value.trim();


        const itemDescription =
            document.getElementById(
                "itemDescription"
            ).value.trim();


        const costPrice =
            Number(
                document.getElementById(
                    "costPrice"
                ).value
            );


        const sellingPrice =
            Number(
                document.getElementById(
                    "sellingPrice"
                ).value
            );


        const stockQuantity =
            Number(
                document.getElementById(
                    "stockQuantity"
                ).value
            );


        const reorderLevel =
            Number(
                document.getElementById(
                    "reorderLevel"
                ).value
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

            itemCode:
                itemCodeInput.value,

            category:
                category,

            itemType:
                itemType,

            itemDescription:
                itemDescription,

            costPrice:
                costPrice,

            sellingPrice:
                sellingPrice,

            stockQuantity:
                stockQuantity,

            reorderLevel:
                reorderLevel

        };


        // =====================================
        // ADD PRODUCT
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
        // CHECK STORAGE
        // =====================================

        console.log(
            "Product saved:",
            product
        );

        console.log(
            "Complete inventory:",
            inventory
        );


        // =====================================
        // SUCCESS MODAL
        // =====================================

        const successModalElement =
            document.getElementById(
                "successModal"
            );


        const successContinueBtn =
            document.getElementById(
                "successContinueBtn"
            );


        if (
            successModalElement &&
            successContinueBtn
        ) {

            const successModal =
                new bootstrap.Modal(
                    successModalElement
                );


            successModal.show();


            successContinueBtn.onclick =
                function () {

                    window.location.href =
                        "products.html";

                };

        }

        else {

            // Fallback if modal is missing

            window.location.href =
                "products.html";

        }

    }
);