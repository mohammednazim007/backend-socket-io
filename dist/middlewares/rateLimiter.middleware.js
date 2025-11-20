"use strict";
// ============================================================
// ✅ Middleware: rateLimiter
// PURPOSE:
//    - Prevent frequent requests to sensitive routes (e.g., send-otp)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
// 🔹 OTP request limiter (example: max 3 requests per 5 minutes)
exports.rateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 3 OTP requests per window
    message: {
        success: false,
        message: "Too many OTP requests, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
//# sourceMappingURL=rateLimiter.middleware.js.map