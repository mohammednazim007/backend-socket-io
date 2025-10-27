import { Request, Response } from "express";
import {
  sendRequest,
  cancelRequest,
  acceptedFriend,
  getNonFriendUsers,
  acceptRequest,
  getRequestedFriend,
} from "./friend.service";

// ============================================================
// ✅ CONTROLLER: getAllNonFriendUsers
// METHOD: GET
// ROUTE: /friends/non-friends
// PURPOSE:
//    - Retrieve all users who are NOT friends, NOT requested, and NOT the current user.
// LOGIC:
//    - Extracts logged-in user's ID from request.
//    - Calls `getNonFriendUsers` service to fetch eligible users.
//    - Responds with the list or error if something goes wrong.
// ============================================================
export const getAllNonFriendUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await getNonFriendUsers(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// ✅ CONTROLLER: getAllRequestedFriend
// METHOD: GET
// ROUTE: /friends/requests
// PURPOSE:
//    - Retrieve all incoming friend requests for the logged-in user.
// LOGIC:
//    - Gets user ID from request.
//    - Calls `getRequestedFriend` service to fetch pending requests.
//    - Returns pending friend requests or an error message.
// ============================================================
export const getAllRequestedFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await getRequestedFriend(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// ✅ CONTROLLER: sendFriendRequest
// METHOD: PUT
// ROUTE: /friends/send
// PURPOSE:
//    - Handles sending a new friend request from one user to another.
// LOGIC:
//    - Reads `senderId` and `receiverId` from request body.
//    - Calls `sendRequest` service to process and notify the receiver.
//    - Returns success message or error details.
// ============================================================
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await sendRequest(senderId, receiverId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// ✅ CONTROLLER: getAcceptedFriend
// METHOD: GET
// ROUTE: /friends/accepted
// PURPOSE:
//    - Retrieves all friends (accepted connections) of the logged-in user.
// LOGIC:
//    - Extracts user ID from request.
//    - Calls `acceptedFriend` service to get confirmed friends list.
//    - Returns user data or error.
// ============================================================
export const getAcceptedFriend = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const result = await acceptedFriend(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// ✅ CONTROLLER: cancelFriendRequest
// METHOD: DELETE
// ROUTE: /friends/cancel/:receiverId
// PURPOSE:
//    - Allows the sender to cancel a pending friend request.
// LOGIC:
//    - Extracts `senderId` from authenticated user and `receiverId` from route params.
//    - Calls `cancelRequest` service to remove pending requests and delete notifications.
//    - Logs and returns appropriate success or error message.
// ============================================================
export const cancelFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id as string;
    const { receiverId } = req.params;

    const result = await cancelRequest(senderId, receiverId);
    return res.status(200).json(result);
  } catch (error: any) {
    // Log error for debugging, then send generic 400 response
    console.error("Cancel Request Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// ✅ CONTROLLER: acceptFriendRequest
// METHOD: PUT
// ROUTE: /friends/accept
// PURPOSE:
//    - Handles accepting an incoming friend request.
// LOGIC:
//    - Reads `senderId` and `receiverId` from request body.
//    - Calls `acceptRequest` service to add both users to each other’s friends list.
//    - Responds with updated user data or an error message.
// ============================================================
export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await acceptRequest(senderId, receiverId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
