import { redisGet, redisSet } from "../lib/redis";
import getInventory from "../api/getInventory";

async function getOrCacheInventory(userSession: string) {
    const key = "inventory";

    const inventory = await redisGet(key);
    if (inventory.error || inventory.data != null) return inventory;
    
    const inventoryData = await getInventory(userSession);
    redisSet(key, inventoryData.data);
    return { ...inventoryData };
}

export default getOrCacheInventory;