import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  senderId: string;
  receiverId: string;
  type: "friend_request" | "message" | "system";
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    type: {
      type: String,
      enum: ["friend_request", "message", "system"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
