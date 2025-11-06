// ============================================================
// ✅ Middleware: rateLimiter
// PURPOSE:
//    - Prevent frequent requests to sensitive routes (e.g., send-otp)
// ============================================================

import { rateLimit } from "express-rate-limit";

// 🔹 OTP request limiter (example: max 3 requests per 5 minutes)
export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // Limit each IP to 3 OTP requests per window
  message: {
    success: false,
    message: "Too many OTP requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
