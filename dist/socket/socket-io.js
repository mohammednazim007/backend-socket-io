"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.getReceiverSocketId = exports.initSocket = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const socket_io_1 = require("socket.io");
const notification_model_1 = __importDefault(require("@/modules/notification/notification.model"));
const userSocketMap = {};
let io;
const initSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
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
        const emitAllNotifications = async (userId) => {
            try {
                const allNotifications = await notification_model_1.default.find({
                    receiverId: userId,
                }).sort({ createdAt: -1 });
                socket.emit("all_notifications", allNotifications);
            }
            catch (err) {
                console.error("Error emitting notifications:", err);
            }
        };
        // ✅ Read all notifications
        socket.on("read_all_notifications", async ({ receiver_id }) => {
            try {
                await notification_model_1.default.updateMany({ receiverId: receiver_id }, { $set: { isRead: true } });
                await emitAllNotifications(receiver_id);
            }
            catch (err) {
                console.error("Error marking all as read:", err);
            }
        });
        // ✅ Read a single notification
        socket.on("read_single_notification", async ({ notificationId }) => {
            try {
                await notification_model_1.default.findByIdAndUpdate(notificationId, {
                    $set: { isRead: true },
                });
                if (uid)
                    await emitAllNotifications(uid);
            }
            catch (err) {
                console.error("Error marking single notification as read:", err);
            }
        });
        // ✅ When user reconnects
        if (uid) {
            try {
                await emitAllNotifications(uid);
            }
            catch (err) {
                console.error("Error fetching notifications on reconnect:", err);
            }
        }
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${uid}`);
            if (uid)
                delete userSocketMap[uid];
            io.emit("get_online_users", Object.keys(userSocketMap));
        });
    });
};
exports.initSocket = initSocket;
const getReceiverSocketId = (receiver_id) => {
    return userSocketMap[receiver_id];
};
exports.getReceiverSocketId = getReceiverSocketId;
//# sourceMappingURL=socket-io.js.map