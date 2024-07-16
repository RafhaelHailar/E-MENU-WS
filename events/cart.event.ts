import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";
import redis from "../lib/redis";
import io from "../lib/socket.io";


export default function(socket: Socket) {
    const { userSession, tableSession } = socket.handshake.query as  { userSession: string, tableSession: string }; 

    socket.on("add cart", (data) => {
        const productId = data.productId;

        const key = `${tableSession}-cart:${productId}`;

        console.log(key);
    });
}