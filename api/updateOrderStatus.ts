import asyncHandler from "../utils/asyncHandler";

async function updateOrderStatus(userSession, orderNo, status) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/order/status`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `_user_session=${userSession}`
        },
        body: JSON.stringify({orderNo,status})
    });

    return request;
}

export default asyncHandler(updateOrderStatus);