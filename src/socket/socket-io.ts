import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Notification from "@/modules/notification/notification.model";

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

  io.on("connection", async (socket) => {
    const user_id = socket.handshake.query.user_id;
    const uid = Array.isArray(user_id) ? user_id[0] : user_id;

    if (uid) {
      userSocketMap[uid] = socket.id;
      console.log(`✅ User connected: ${uid} (${socket.id})`);
    }

    // ** Emit online users to all clients
    io.emit("get_online_users", Object.keys(userSocketMap));

    // ** Typing events
    socket.on("typing", ({ sender_id, receiver_id }) => {
      const receiverSocketId = userSocketMap[receiver_id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", sender_id);
      }
    });

    socket.on("stop_typing", ({ sender_id, receiver_id }) => {
      const receiverSocketId = userSocketMap[receiver_id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing", sender_id);
      }
    });

    // ✅ Helper to emit all notifications for a user
    const emitAllNotifications = async (userId: string) => {
      try {
        const allNotifications = await Notification.find({
          receiverId: userId,
        }).sort({ createdAt: -1 });

        socket.emit("all_notifications", allNotifications);
      } catch (err) {
        console.error("Error emitting notifications:", err);
      }
    };

    // ✅ Read all notifications
    socket.on("read_all_notifications", async ({ receiver_id }) => {
      try {
        await Notification.updateMany(
          { receiverId: receiver_id },
          { $set: { isRead: true } }
        );
        await emitAllNotifications(receiver_id);
      } catch (err) {
        console.error("Error marking all as read:", err);
      }
    });

    // ✅ Read a single notification
    socket.on("read_single_notification", async ({ notificationId }) => {
      try {
        await Notification.findByIdAndUpdate(notificationId, {
          $set: { isRead: true },
        });
        if (uid) await emitAllNotifications(uid);
      } catch (err) {
        console.error("Error marking single notification as read:", err);
      }
    });

    // ✅ When user reconnects
    if (uid) {
      try {
        await emitAllNotifications(uid);
      } catch (err) {
        console.error("Error fetching notifications on reconnect:", err);
      }
    }

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
