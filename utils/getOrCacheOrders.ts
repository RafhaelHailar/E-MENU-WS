import { redisGet, redisSet } from "../lib/redis";
import getOrders from "../api/getOrders";

async function getOrCacheOrders(userSession: string) {
    const key = "orders";

    const orders = await redisGet(key);
    if (orders.error || orders.data != null) return orders;
    
    const ordersData = await getOrders(userSession);
    redisSet(key, ordersData.data);
    return { ...ordersData };
}

export default getOrCacheOrders;