import asyncHandler from "../utils/asyncHandler";

async function getOrders(userSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/orders`, {
        credentials: "include",
        headers: {
            "Cookie": `_user_session=${userSession}`
        },
    });

    return request;
}

export default asyncHandler(getOrders);