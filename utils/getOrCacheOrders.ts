import redis from "../lib/redis";
import getOrders from "../api/getOrders";

async function getOrCacheOrders(userSession: string) {
    try {
        const orders = await redis.get("orders");
        if (orders != null) return orders;
        else {
            const ordersData = await getOrders(userSession);
            console.log(ordersData)
            redis.set("orders",JSON.stringify(ordersData));
            return ordersData;
        }
    } catch (e) {
        console.error(e);
    }
}

export default getOrCacheOrders;