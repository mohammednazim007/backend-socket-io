//** export default router;
import express, { Router } from "express";
import {
  sendFriendRequest,
  getAcceptedFriend,
  getAllNonFriendUsers,
  cancelFriendRequest,
  acceptFriendRequest,
  getAllRequestedFriend,
} from "./friend.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router: Router = express.Router();

//** Get all users who are not friends or requested
router.get("/non-friends", authMiddleware, getAllNonFriendUsers);

//** Get all incoming friend requests
router.get("/get-requested-friends", authMiddleware, getAllRequestedFriend);

//** Send a friend request to another user
router.put("/send-request", authMiddleware, sendFriendRequest);

//** Get all accepted friends of logged-in user
router.get("/accepted-friends", authMiddleware, getAcceptedFriend);

//** Accept a friend request
router.put("/accept-request", authMiddleware, acceptFriendRequest);

//** Cancel a sent friend request
router.delete(
  "/cancel-request/:receiverId",
  authMiddleware,
  cancelFriendRequest
);

export default router;
