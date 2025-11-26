import { Server } from "socket.io";
import { Server as HttpServer } from "http";
declare let io: Server;
export declare const initSocket: (server: HttpServer) => void;
export declare const getReceiverSocketId: (receiver_id: string) => string;
export { io };
