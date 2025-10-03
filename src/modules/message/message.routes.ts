import express, { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getMessagesController,
  sendMessageController,
} from "./message.controller";
import { upload } from "../../cloudinary/upload";

const router: Router = express.Router();

router.get("/:receiver_id", authMiddleware, getMessagesController);
router.post(
  "/send/:sender_id",
  upload.single("media"),
  authMiddleware,
  sendMessageController
);

export default router;
