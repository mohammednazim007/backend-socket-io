import mongoose from "mongoose";
export interface IMessage {
  text?: string;
  media?: string;
  isRead: boolean;
  sender_id: string | mongoose.Types.ObjectId;
  receiver_id: string | mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
