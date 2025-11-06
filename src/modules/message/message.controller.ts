import { Request, Response, NextFunction } from "express";
import { getReceiverSocketId, io } from "@/socket/socket-io";
import cloudinary from "@/cloudinary/cloudinary";
import { createMessage, getMessages } from "@/modules/message/message.service";
import mongoose from "mongoose";

// ✅ Send message
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sender_id, text } = req.body;
    const { receiver_id } = req.params; // comes from URL

    // Type guard
    if (!sender_id || !receiver_id) {
      return res
        .status(400)
        .json({ message: "sender_id and receiver_id are required" });
    }

    let mediaPath: string | undefined;

    // ✅ Handle image upload if present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      mediaPath = result.secure_url;
    }

    // ✅ Create message in MongoDB
    const newMessage = await createMessage({
      text,
      media: mediaPath,
      sender_id: new mongoose.Types.ObjectId(sender_id),
      receiver_id: new mongoose.Types.ObjectId(receiver_id),
    });

    // ✅ Emit message to receiver if online
    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_message", newMessage);
    }

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sender_id, receiver_id } = req.body;

    if (!sender_id || !receiver_id) {
      return res
        .status(400)
        .json({ message: "sender_id and receiver_id are required" });
    }

    const messages = await getMessages(
      sender_id as string,
      receiver_id as string
    );

    res
      .status(200)
      .json({ messages: "Chat history fetched successfully", data: messages });
  } catch (error) {
    next(error);
  }
};
