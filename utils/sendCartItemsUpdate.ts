import { redisGet } from "../lib/redis";
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
            const value = await redisGet(key);
            cartItems.push({id, quantity: Number(value.data)});
        }
        
        socket.emit("cart update", {data: cartItems});
    } catch (error) {
        console.log(error);
        socket.emit("error", { error })
    }
}

export default sendCartItemsUpdate;