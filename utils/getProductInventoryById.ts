import getOrCacheInventory from "./getOrCacheInventor";


async function getProductInventoryById(userSession: string,id: string) {
    const inventory = await getOrCacheInventory(userSession);
    
    if (inventory.error) return console.error("couldn't cache inventory");

    return inventory.data.find(item => item.id === id);
}

export default getProductInventoryById;