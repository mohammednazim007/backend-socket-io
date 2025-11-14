import { Router } from "express";
import {
  sendOTP,
  verifyOTPAndResetPassword,
  changePassword,
} from "@/modules/reset-password/email.controller";
import { rateLimiter } from "@/middlewares/rateLimiter.middleware";

const router: Router = Router();

router.post("/send-otp", rateLimiter, sendOTP);
router.post("/verify-otp", rateLimiter, verifyOTPAndResetPassword);
router.put("/change-password", rateLimiter, changePassword);

export default router;
