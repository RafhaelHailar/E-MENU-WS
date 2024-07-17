import { redisGet } from "../lib/redis";
import getKeysWithPrefix from "./getKeysWithPrefix";

async function getCartItem( tableSession: string) {
    const prefix = `${tableSession}-cart:`;
    const cartItemsKey = await getKeysWithPrefix(prefix);
    const cartItems = [];

    for (let i = 0;i < cartItemsKey.length;i++) {
        const key = cartItemsKey[i];
        const id = key.split(prefix)[1];
        const value = await redisGet(key);
        cartItems.push({id, quantity: Number(value.data)});
    }
    
    return cartItems;
}

export default getCartItem;