
async function getOrders(userSession: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/orders`, {
        credentials: "include",
        headers: {
            "Cookie": `_user_session=${userSession}`
        },
    });

    const order = await request.json();

    return order;
}

export default getOrders;