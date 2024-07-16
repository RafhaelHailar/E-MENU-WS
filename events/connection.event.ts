import { Socket } from "socket.io";
import getOrCacheOrders from "../utils/getOrCacheOrders";


export default function(socket: Socket) {
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    });
};