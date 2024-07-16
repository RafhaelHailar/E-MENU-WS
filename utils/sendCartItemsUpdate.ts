import redis from "../lib/redis";
import { Socket } from "socket.io";
import getKeysWithPrefix from "./getKeysWithPrefix";

async function sendCartItemsUpdate(socket: Socket, tableSession: string) {
    try {
        const prefix = `${tableSession}-cart:`;
        const cartItemsKey = await getKeysWithPrefix(prefix);
        const cartItems = [];
    
        for (let i = 0;i < cartItemsKey.length;i++) {
            const key = cartItemsKey[i];
            const id = key.split(prefix)[1];
            const value = Number(await redis.get(key));
            cartItems.push({id, quantity: value});
        }
        
        socket.emit("cart update", {data: cartItems});
    } catch (e) {
        console.log(e);
    }
}

export default sendCartItemsUpdate;