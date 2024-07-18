import { redisGet, redisSet } from "../lib/redis";
import getTableSessions from "../api/getTableSessions";

async function getOrCacheTableSessions(userSession: string) {
    const key = "table_session";

    const sessions = await redisGet(key);
    if (sessions.error || sessions.data != null) return sessions;
    
    const sessionsData = await getTableSessions(userSession);
    redisSet(key, sessionsData.data);
    return { ...sessionsData };
}

export default getOrCacheTableSessions;