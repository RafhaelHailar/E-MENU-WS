import { Socket } from "socket.io";
import getOrCacheTableSessions from "utils/getOrCacheTableSessions";

export default function(socket: Socket) {
    const { userSession } = socket.handshake.query as  { userSession: string }; 
    
    socket.on("get table sessions", async () => {
        const tableSessions = await getOrCacheTableSessions(userSession);

        if (!tableSessions.error)
            socket.emit("table sessions sent", tableSessions);
    })
}