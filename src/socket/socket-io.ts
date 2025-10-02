import { Server } from "socket.io";
import { Server as HttpServer } from "http"; // or from "https" if using https

const userSocketMap: Record<string, string> = {};
let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || "http://localhost:3000"], // fallback if undefined
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const user_id = socket.handshake.query.user_id;
    const uid = Array.isArray(user_id) ? user_id[0] : user_id; // normalize type

    if (uid) {
      userSocketMap[uid] = socket.id;
    }

    // ✅ Emit online users
    io.emit("get_online_users", Object.keys(userSocketMap));

    // ✅ Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", uid);

      if (uid) {
        delete userSocketMap[uid];
      }
      io.emit("get_online_users", Object.keys(userSocketMap));
    });
  });
};

// ** Receiver Socket ID
export const getReceiverSocketId = (receiver_id: string) => {
  return userSocketMap[receiver_id];
};

export { io };
