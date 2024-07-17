import asyncHandler from "../utils/asyncHandler";

async function getMyLatestOrder(tableSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/my_latest_order`, {
        credentials: "include",
        headers: {
            "Cookie": `_table_session=${tableSession}`
        },
    });

    return request;
}

export default asyncHandler(getMyLatestOrder);