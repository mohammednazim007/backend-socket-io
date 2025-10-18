import { Request, Response } from "express";
import { sendRequest } from "./friend.service";
import User from "../user/user.model";

// ** Get the all friends
export const getAllFriends = async (req: Request, res: Response) => {
  const userId = (req as any).user.id as string;
  const users = await User.find({ _id: { $ne: userId } });
  console.log("user id", userId);

  if (!users) throw new Error("Users not found");
  res.status(200).json({
    message: "Users found",
    users,
  });
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

// ** Accept friend request
// export const acceptFriendRequest = async (req: Request, res: Response) => {
//   try {
//     const { userId, requesterId } = req.body;
//     const result = await acceptRequest(userId, requesterId);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };

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
