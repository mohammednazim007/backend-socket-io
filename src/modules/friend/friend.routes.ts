import express, { Router } from "express";
import { getAllFriends, sendFriendRequest } from "./friend.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/all-friends", authMiddleware, getAllFriends);
router.put("/send-request", authMiddleware, sendFriendRequest);

export default router;
