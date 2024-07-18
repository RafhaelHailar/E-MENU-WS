import getAllTableSessions from "./getAllTableSessions";

async function sendTableQueues() {
    const tableSessions = await getAllTableSessions();
    io.emit("table queues sent", {data: tableSessions});
}

export default sendTableQueues;