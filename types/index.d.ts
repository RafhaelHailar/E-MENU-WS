import { Redis } from "ioredis";
import { Server } from "socket.io";

declare global {
    var redis: Redis | undefined;
    var io: Server | undefined;
}

export {};