import { Request, Response } from "express";
import {
  sendRequest,
  cancelRequest,
  acceptedFriend,
  getNonFriendUsers,
  acceptRequest,
} from "./friend.service";

// ** Get all non-friend users
export const getAllNonFriendUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await getNonFriendUsers(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** Send friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await sendRequest(senderId, receiverId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** Get sent friend requests
export const getAcceptedFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await acceptedFriend(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** Cancel friend request
export const cancelFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const { receiverId } = req.params;
    const result = await cancelRequest(userId, receiverId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ** Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await acceptRequest(senderId, receiverId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// // ** Reject friend request
// export const rejectFriendRequest = async (req: Request, res: Response) => {
//   try {
//     const { userId, requesterId } = req.body;
//     const result = await rejectRequest(userId, requesterId);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };
