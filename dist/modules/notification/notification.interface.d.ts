import mongoose from "mongoose";
export interface INotification {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    name: string;
    avatar: string;
    type: "friend_request" | "message" | "system";
    message: string;
    isRead: boolean;
    createdAt: Date;
}
