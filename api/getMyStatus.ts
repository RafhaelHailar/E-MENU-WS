import asyncHandler from "../utils/asyncHandler";

async function getMyStatus(tableSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/my_status`, {
        credentials: "include",
        headers: {
            "Cookie": `_table_session=${tableSession}`
        },
    });

    return request;
}

export default asyncHandler(getMyStatus);