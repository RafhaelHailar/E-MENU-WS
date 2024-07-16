import asyncHandler from "../utils/asyncHandler";

async function getMyLatestOrder(tableSession) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/my_latest_order`, {
        credentials: "include",
        headers: {
            "Cookie": `_table_session=${tableSession}`
        },
    });
}

export default asyncHandler(getMyLatestOrder);