import asyncHandler from "../utils/asyncHandler";

async function getTableSessions(userSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/table/queues`, {
        credentials: "include",
        headers: {
            "Cookie": `_user_session=${userSession}`
        },
    });

    return request;
}

export default asyncHandler(getTableSessions);