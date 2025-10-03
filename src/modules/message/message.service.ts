import { getReceiverSocketId, io } from "../../socket/socket-io";
import { IMessage } from "./message.interface";
import Message from "./message.model";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ** Get messages between two users
export const getMessages = async (receiver_id: string, user_id: string) => {
  if (!receiver_id || !user_id) {
    throw new Error("Receiver ID and User ID are required");
  }

  const messages = await Message.find({
    $or: [
      { sender_id: user_id, receiver_id: receiver_id },
      { sender_id: receiver_id, receiver_id: user_id },
    ],
  }).sort({ createdAt: 1 });

  return messages;
};

// ✅ Send message between two users
export const sendMessage = async (message: IMessage) => {
  const { sender_id, receiver_id, text, media } = message;
  console.log("message ", message);

  if (!sender_id || !receiver_id) {
    throw new Error("Sender ID and Receiver ID are required");
  }

  if (!text?.trim() && !media) {
    throw new Error("Message text or media is required");
  }

  let uploadedMediaUrl: string | undefined;

  // ✅ Upload to Cloudinary if media exists
  if (media) {
    const uploadResult = await cloudinary.uploader.upload(media, {
      folder: "messages", // optional: create a folder in cloudinary
      resource_type: "auto", // auto-detects image/video
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    uploadedMediaUrl = uploadResult.secure_url;
  }

  // ✅ Create message with updated media url
  const newMessage = await Message.create({
    sender_id,
    receiver_id,
    text,
    media: uploadedMediaUrl, // store secure_url in DB
  });

  // ✅ Emit message to receiver socket
  const receiverSocketId = getReceiverSocketId(receiver_id);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("new_message", newMessage);
  }

  return newMessage;
};
