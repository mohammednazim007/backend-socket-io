import mongoose, { Schema } from "mongoose";
import { IMessage } from "@/modules/message/message.interface";

const messageSchema = new Schema<IMessage>(
  {
    text: { type: String, trim: true, default: "" },
    media: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friend_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
