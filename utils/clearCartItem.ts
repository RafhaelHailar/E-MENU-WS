import { redisDel } from "../lib/redis";
import getKeysWithPrefix from "./getKeysWithPrefix";

async function clearCart( tableSession: string) {
    const prefix = `${tableSession}-cart:`;
    const cartItemsKey = await getKeysWithPrefix(prefix);

    for (let i = 0;i < cartItemsKey.length;i++) {
        const { error } = await redisDel(cartItemsKey[i]);

        if (error) return 0;
    }
    
    return 1;
}

export default clearCart;