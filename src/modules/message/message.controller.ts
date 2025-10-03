import { Request, Response, NextFunction } from "express";
import { getMessages, sendMessage } from "./message.service";

// ** Get messages between two users
export const getMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const receiver_id = req.params.receiver_id;
    const user_id = req.user?.id as string;

    const messages = await getMessages(receiver_id, user_id);

    return res.status(200).json({
      message: "Messages retrieved successfully",
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// ** Send message between two users
export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Text comes from body
    const text = req.body.text;

    // File comes from multer
    const file = req.file as Express.Multer.File | undefined;

    const message = await sendMessage({
      text,
      sender_id: req.user?.id as string,
      receiver_id: req.params.sender_id,
      media: file?.path, // multer gives local path
    });

    return res.status(201).json({
      message: "Message sent successfully",
      messages: message,
    });
  } catch (error) {
    next(error);
  }
};
