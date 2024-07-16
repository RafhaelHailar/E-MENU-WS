import asyncHandler from "../utils/asyncHandler";

async function login(email: string,password: string) {
    const request = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
    });

    return request;
}

export default asyncHandler(login);