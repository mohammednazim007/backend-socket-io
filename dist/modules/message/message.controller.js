"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = exports.sendMessage = void 0;
const socket_io_1 = require("../../socket/socket-io");
const cloudinary_config_1 = __importDefault(require("../../cloudinary-config/cloudinary-config"));
const message_service_1 = require("../../modules/message/message.service");
const mongoose_1 = __importDefault(require("mongoose"));
// ============================================================
// ✅ ROUTE: POST /messages/:friend_id
// PURPOSE:
//    - Send a text or image message from the authenticated user
//      to a specified friend (receiver).
// DESCRIPTION:
//    - Handles both plain text and optional media (image upload).
//    - Saves the message to MongoDB.
//    - Emits the new message to the receiver in real-time if they are online.
// ============================================================
const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user?.id;
        const { friend_id } = req.params;
        // ** Validation
        if (!userId || !friend_id) {
            return res.status(400).json({
                success: false,
                message: "Both sender_id and receiver_id are required.",
            });
        }
        let mediaPath;
        //** Upload media to Cloudinary (if file present)
        if (req.file) {
            const result = await cloudinary_config_1.default.uploader.upload(req.file.path);
            mediaPath = result.secure_url;
        }
        // ** Create and save message in MongoDB
        const newMessage = await (0, message_service_1.createMessage)({
            text,
            media: mediaPath,
            user_id: new mongoose_1.default.Types.ObjectId(userId),
            friend_id: new mongoose_1.default.Types.ObjectId(friend_id),
        });
        // ** Emit message to receiver (if online)
        const receiverSocketId = (0, socket_io_1.getReceiverSocketId)(friend_id);
        if (receiverSocketId) {
            socket_io_1.io.to(receiverSocketId).emit("new_message", newMessage);
        }
        // ✅ Success response
        return res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: newMessage,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(400).json({ message, success: false });
    }
};
exports.sendMessage = sendMessage;
// ============================================================
// ✅ ROUTE: GET /messages/:friend_id
// PURPOSE:
//    - Fetch the chat history between the authenticated user
//      and the specified friend.
// DESCRIPTION:
//    - Retrieves all messages (both sent and received)
//      between the two users from MongoDB.
// ============================================================
const getChatHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { friend_id } = req.params;
        // ** Fetch chat history from the database
        const messages = await (0, message_service_1.getMessages)(userId, friend_id);
        // ✅ Success response
        return res.status(200).json({
            success: true,
            message: "Chat history fetched successfully.",
            data: messages,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(400).json({ message, success: false });
    }
};
exports.getChatHistory = getChatHistory;
//# sourceMappingURL=message.controller.js.map