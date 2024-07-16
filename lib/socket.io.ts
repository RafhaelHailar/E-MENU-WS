import { Server } from "socket.io";
import redis from "./redis";

import connectionEvent from "../events/connection.event";
import orderEvent from "../events/order.event";

export default function(io: Server) {
    
    io.on("connection", socket => {
        console.log("user connected: ", socket.id);
        const {userSession, tableSession} = socket.handshake.query as {userSession: string, tableSession: string};
        
        if (!userSession && !tableSession) return socket.disconnect(true);
        
        if (userSession) redis.set(`user-session-${userSession}`, socket.id);
        if (tableSession) redis.set(`table-session-${tableSession}`, socket.id);

        connectionEvent(socket);
        orderEvent(socket);
    });
}