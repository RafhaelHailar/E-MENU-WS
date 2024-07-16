import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";
import redis from "../lib/redis";
import io from "../lib/socket.io";
import getOrCacheTableStatus from "../utils/getOrCacheTableStatus";


export default function(socket: Socket) {
    const { userSession, tableSession } = socket.handshake.query as  { userSession: string, tableSession: string }; 

    socket.on("add cart", async (data) => {
        const productId = data.productId;
        const tableStatus = JSON.parse(await getOrCacheTableStatus(tableSession));

        if (tableStatus.status !== 200) return socket.emit("error add cart", tableStatus);

        const key = `${tableSession}-cart:${productId}`;

        console.log(key);
    });
}