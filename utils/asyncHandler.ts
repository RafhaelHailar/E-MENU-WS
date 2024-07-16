

function asyncHandler(fn: Function) {
    return async function (...params: any[]) {
        try {
            const data = await fn(...params);
            return data;
        } catch (error) {
            return { error };
        }
    }    
}

export default asyncHandler;