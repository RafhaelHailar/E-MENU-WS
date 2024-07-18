import { Socket } from "socket.io";
import getAllTableSessions from "../utils/getAllTableSessions";
import sendTableQueues from "../utils/sendTableQueues";

export default async function(socket: Socket) {
    const { userSession } = socket.handshake.query as  { userSession: string }; 

    socket.on("get table queues", async () => {
        await sendTableQueues();
    });

    if (userSession) {
        await sendTableQueues();
    }
}