import redis from "../lib/redis";
import getMyStatus from "../api/getMyStatus";

async function getOrCacheTableStatus(tableSession: string) {
    const key = `table_status:${tableSession}`;
    try {
        const status = await redis.get(key);
        if (status != null) return status;
        else {
            const status = await getMyStatus(tableSession);
            const raw = JSON.stringify(status);
            redis.set(key,raw);
            return raw;
        }
    } catch (e) {
        console.error(e);
    }
}

export default getOrCacheTableStatus;