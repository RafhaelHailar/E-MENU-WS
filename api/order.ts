import asyncHandler from "../utils/asyncHandler";

async function order(tableSession: string, { items, paymentMethod} ) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/order`, {
        method: "POST",
        headers: {
            "Cookie": `_table_session=${tableSession}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({items, paymentMethod})
    });

    return request;
}

export default asyncHandler(order);