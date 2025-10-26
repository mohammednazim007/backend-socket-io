import express, { Router } from "express";
import {
  sendFriendRequest,
  getAcceptedFriend,
  getAllNonFriendUsers,
  cancelFriendRequest,
  acceptFriendRequest,
} from "./friend.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/non-friends", authMiddleware, getAllNonFriendUsers); //1
router.put("/send-request", authMiddleware, sendFriendRequest); //2
router.get("/accepted-friends", authMiddleware, getAcceptedFriend); //3
router.put("/accept-request", authMiddleware, acceptFriendRequest); //4
router.delete(
  "/cancel-request/:receiverId",
  authMiddleware,
  cancelFriendRequest
);

export default router;
