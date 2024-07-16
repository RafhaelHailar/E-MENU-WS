import transformResponse from "../utils/transformResponse";

async function getMyStatus(tableSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/my_status`, {
        credentials: "include",
        headers: {
            "Cookie": `_table_session=${tableSession}`
        },
    });

    const response = await transformResponse(request);
    return response;
}

export default getMyStatus;