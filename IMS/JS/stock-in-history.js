// =====================================
// GET STOCK-IN HISTORY
// =====================================

const stockInHistory =
    JSON.parse(
        localStorage.getItem(
            "stockInHistory"
        )
    ) || [];


// =====================================
// GET HTML ELEMENTS
// =====================================

const historyBody =
    document.getElementById(
        "stockInHistoryBody"
    );

const emptyHistory =
    document.getElementById(
        "emptyHistory"
    );


// =====================================
// CHECK HISTORY
// =====================================

if (
    stockInHistory.length === 0
) {

    emptyHistory.classList.remove(
        "d-none"
    );

} else {

    displayHistory();

}


// =====================================
// DISPLAY HISTORY
// =====================================

function displayHistory() {

    historyBody.innerHTML = "";


    // =====================================
    // DISPLAY NEWEST FIRST
    // =====================================

    const history =
        [...stockInHistory].reverse();


    history.forEach(
        function (record, index) {

            const row =
                document.createElement(
                    "tr"
                );


            // =====================================
            // FORMAT DATE
            // =====================================

            const formattedDate =
                record.date
                    ? new Date(
                        record.date
                    ).toLocaleString(
                        "en-NG",
                        {
                            dateStyle:
                                "medium",
                            timeStyle:
                                "short"
                        }
                    )
                    : "N/A";


            // =====================================
            // CURRENCY
            // =====================================

            const currency =
                record.currency || "₦";


            // =====================================
            // CREATE ROW
            // =====================================

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${record.itemCode || "N/A"}
                    </strong>
                </td>

                <td>
                    ${record.itemType || "N/A"}
                </td>

                <td>
                    ${record.category || "N/A"}
                </td>

                <td>
                    <span class="badge bg-success">
                        +${Number(
                            record.quantity
                        )}
                    </span>
                </td>

                <td>
                    ${Number(
                        record.previousStock
                    )}
                </td>

                <td>
                    <strong>
                        ${Number(
                            record.newStock
                        )}
                    </strong>
                </td>

                <td>
                    ${currency}${Number(
                        record.costPrice
                    ).toLocaleString()}
                </td>

                <td>
                    <strong>
                        ${currency}${Number(
                            record.totalPrice
                        ).toLocaleString()}
                    </strong>
                </td>

                <td>
                    <small>
                        ${formattedDate}
                    </small>
                </td>

            `;


            // =====================================
            // ADD ROW
            // =====================================

            historyBody.appendChild(
                row
            );

        }
    );

}