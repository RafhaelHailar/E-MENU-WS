
async function updateOrderStatus(userSession, orderNo, status) {
    
    try {
        const request = await fetch(`${process.env.API_SERVER_BASE_URL}/order/status`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `_user_session=${userSession}`
            },
            body: JSON.stringify({orderNo,status})
        });
    
        const data = await request.json();
    
        console.log(data.message);
        return { status: request.status, data};
    } catch (error) {
        return { error };
    }
}

export default updateOrderStatus;