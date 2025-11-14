import { Request, Response, NextFunction } from "express";
import { getReceiverSocketId, io } from "@/socket/socket-io";
import cloudinary from "@/cloudinary/cloudinary";
import { createMessage, getMessages } from "@/modules/message/message.service";
import mongoose from "mongoose";

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
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text } = req.body;
    const userId = req.user?.id as string;
    const { friend_id } = req.params;

    // ** Validation
    if (!userId || !friend_id) {
      return res.status(400).json({
        success: false,
        message: "Both sender_id and receiver_id are required.",
      });
    }

    let mediaPath: string | undefined;

    //** Upload media to Cloudinary (if file present)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      mediaPath = result.secure_url;
    }

    // ** Create and save message in MongoDB
    const newMessage = await createMessage({
      text,
      media: mediaPath,
      user_id: new mongoose.Types.ObjectId(userId),
      friend_id: new mongoose.Types.ObjectId(friend_id),
    });

    // ** Emit message to receiver (if online)
    const receiverSocketId = getReceiverSocketId(friend_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_message", newMessage);
    }

    // ✅ Success response
    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: GET /messages/:friend_id
// PURPOSE:
//    - Fetch the chat history between the authenticated user
//      and the specified friend.
// DESCRIPTION:
//    - Retrieves all messages (both sent and received)
//      between the two users from MongoDB.
// ============================================================
export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const { friend_id } = req.params;

    // ** Fetch chat history from the database
    const messages = await getMessages(userId, friend_id);

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Chat history fetched successfully.",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
