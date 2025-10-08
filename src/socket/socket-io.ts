import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Message from "../modules/message/message.model";

const userSocketMap: Record<string, string> = {};
let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const user_id = socket.handshake.query.user_id;
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;

    if (uid) {
      userSocketMap[uid] = socket.id;
      console.log(`✅ User connected: ${uid} (${socket.id})`);
    }

    // ** Emit online users to all clients
    io.emit("get_online_users", Object.keys(userSocketMap));

    // ** Handle typing events
    socket.on("typing", ({ sender_id, receiver_id }) => {
      const receiverSocketId = userSocketMap[receiver_id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", sender_id);
      }
    });

    // ** Handle stop typing events
    socket.on("stop_typing", ({ sender_id, receiver_id }) => {
      const receiverSocketId = userSocketMap[receiver_id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing", sender_id);
      }
    });

    // ✅ Mark messages as read
    socket.on("mark_as_read", async ({ sender_id, receiver_id }) => {
      await Message.updateMany(
        { sender_id, receiver_id, isRead: false },
        { $set: { isRead: true } }
      );

      const senderSocketId = userSocketMap[sender_id];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messages_seen", { reader_id: receiver_id });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${uid}`);
      if (uid) delete userSocketMap[uid];
      io.emit("get_online_users", Object.keys(userSocketMap));
    });
  });
};

export const getReceiverSocketId = (receiver_id: string) => {
  return userSocketMap[receiver_id];
};

export { io };
