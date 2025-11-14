import express, { Router } from "express";
import { upload } from "@/cloudinary/upload";
import {
  getChatHistory,
  sendMessage,
} from "@/modules/message/message.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router: Router = express.Router();

// Send a message (text + image)
router.post(
  "/send/:friend_id",
  authMiddleware,
  upload.single("media"),
  sendMessage
);

// Get chat history
// router.post("/get_message", authMiddleware, getChatHistory);
router.get("/get_message/:friend_id", authMiddleware, getChatHistory);

export default router;
