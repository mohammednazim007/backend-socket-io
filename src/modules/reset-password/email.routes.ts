import { Router } from "express";
import {
  sendOTP,
  verifyOTPAndResetPassword,
  resetPassword,
} from "@/modules/reset-password/email.controller";
import { rateLimiter } from "@/utils/rateLimiter";

const router: Router = Router();

router.post("/send-otp", rateLimiter, sendOTP);
router.post("/verify-otp", rateLimiter, verifyOTPAndResetPassword);
router.put("/reset-password", rateLimiter, resetPassword);

export default router;
