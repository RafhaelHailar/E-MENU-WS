
async function getMyStatus(tableSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/my_status`, {
        credentials: "include",
        headers: {
            "Cookie": `_table_session=${tableSession}`
        },
    });

    const status = await request.json();

    return status;
}

export default getMyStatus;