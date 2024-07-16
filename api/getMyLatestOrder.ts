
async function getMyLatestOrder(tableSession) {

    try {
        const request = await fetch(`${process.env.API_SERVER_BASE_URL}/my_latest_order`, {
            credentials: "include",
            headers: {
                "Cookie": `_table_session=${tableSession}`
            },
        });
    
        const latestOrder = await request.json();
    
        return { status: request.status, data: latestOrder};
    } catch (error) {
        return { error };
    }
}

export default getMyLatestOrder;