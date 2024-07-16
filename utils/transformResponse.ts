
async function transformResponse(response) {
    const status = response.status;

    let responseData = response;
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.indexOf("application/json") !== -1) responseData = await response.json();

    if (status < 200 || status >= 300) return { status, error: responseData };
    
    return { status, data: responseData }; 
}

export default transformResponse;