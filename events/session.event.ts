import { Socket } from "socket.io";
import getAllTableSessions from "../utils/getAllTableSessions";

export default async function(socket: Socket) {
    const { userSession } = socket.handshake.query as  { userSession: string }; 

    socket.on("get table queues", async () => {
        console.log("hello from client")
        const tableSessions = await getAllTableSessions();
        console.log(tableSessions);
        socket.emit("table queues sent", tableSessions);
    });

    if (userSession) {
        const tableSessions = await getAllTableSessions();
        socket.emit("table queues sent", {data: tableSessions});
    }
}