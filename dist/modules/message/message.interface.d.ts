import mongoose from "mongoose";
export interface IMessage {
    text?: string;
    media?: string;
    isRead: boolean;
    user_id: string | mongoose.Types.ObjectId;
    friend_id: string | mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
