async function login(email,password) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
    });

    return await request.json();
}

export default login;