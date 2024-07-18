import { redisHGetAll } from "../lib/redis";
import getKeysWithPrefix from "./getKeysWithPrefix";

async function getTableSessions() {
    const prefix = `table-session:`;
    const tableSessionKeys = await getKeysWithPrefix(prefix);
    const tableSessions = [];

    for (let i = 0;i < tableSessionKeys.length;i++) {
        const key = tableSessionKeys[i];
        const {createdAt, socketId, status, tableNo } = (await redisHGetAll(key)).data;
        tableSessions.push({createdAt: (new Date(createdAt)), socketId, status, tableNo });
    }
    
    return tableSessions;
}

export default getTableSessions;