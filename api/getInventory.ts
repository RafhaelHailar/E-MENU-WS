import asyncHandler from "../utils/asyncHandler";

async function getInventory(userSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/inventory`, {
        credentials: "include",
        headers: {
            "Cookie": `_user_session=${userSession}`
        },
    });

    return request;
}

export default asyncHandler(getInventory);