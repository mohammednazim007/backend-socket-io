"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.createMessage = void 0;
const message_model_1 = __importDefault(require("../../modules/message/message.model"));
// ============================================================
// ✅ Create a new message
//    - Saves a message (text/media) to MongoDB.
// ============================================================
const createMessage = async (data) => {
    const message = await message_model_1.default.create(data);
    return message;
};
exports.createMessage = createMessage;
// ============================================================
// ✅ Get chat messages
//    - Fetches all messages between two users (sender & receiver).
// ============================================================
const getMessages = async (userId, friend_id) => {
    if (!userId || !friend_id)
        throw new Error("userId and friend_id are required");
    return await message_model_1.default.find({
        $or: [
            { user_id: userId, friend_id: friend_id },
            { user_id: friend_id, friend_id: userId },
        ],
    }).sort({ createdAt: 1 });
};
exports.getMessages = getMessages;
//# sourceMappingURL=message.service.js.map