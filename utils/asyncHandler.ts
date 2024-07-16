import transformResponse from "./transformResponse";

function asyncHandler(fn: Function) {
    return async function (...params: any[]) {
        try {
            const response = await fn(...params);
            const data = await transformResponse(response);
            
            return data;
        } catch (error) {
            return { status: 500, error };
        }
    }    
}

export default asyncHandler;