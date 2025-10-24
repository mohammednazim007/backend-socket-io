import express, { Router } from "express";
import {
  sendFriendRequest,
  getSentFriendRequests,
  getAllNonFriendUsers,
  cancelFriendRequest,
} from "./friend.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/non-friends", authMiddleware, getAllNonFriendUsers);
router.put("/send-request", authMiddleware, sendFriendRequest);
router.get("/sent-requests", authMiddleware, getSentFriendRequests);
router.delete(
  "/cancel-request/:receiverId",
  authMiddleware,
  cancelFriendRequest
);

export default router;
