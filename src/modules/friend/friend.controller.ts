import { Request, Response } from "express";
import {
  sendRequest,
  cancelRequest,
  acceptedFriend,
  getNonFriendUsers,
  acceptRequest,
  getRequestedFriend,
} from "./friend.service";

// ** GET - Get all non-friend users
export const getAllNonFriendUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await getNonFriendUsers(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** GET - Get the request all friend
export const getAllRequestedFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await getRequestedFriend(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** POST - Send friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await sendRequest(senderId, receiverId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** GET - Get sent friend requests
export const getAcceptedFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await acceptedFriend(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** DELETE - Cancel friend request
export const cancelFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id as string;
    const { receiverId } = req.params;

    if (!senderId)
      res.status(401).json({ message: "Authentication required." });

    if (!receiverId)
      res.status(400).json({ message: "Receiver ID is missing." });

    const result = await cancelRequest(senderId, receiverId);
    return res.status(200).json(result);
  } catch (error: any) {
    // Log error for debugging, then send generic 400 response
    console.error("Cancel Request Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ** POST - Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await acceptRequest(senderId, receiverId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
