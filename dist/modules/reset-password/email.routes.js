"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = require("../../modules/reset-password/email.controller");
const rateLimiter_middleware_1 = require("../../middlewares/rateLimiter.middleware");
const router = (0, express_1.Router)();
router.post("/send-otp", rateLimiter_middleware_1.rateLimiter, email_controller_1.sendOTP);
router.post("/verify-otp", rateLimiter_middleware_1.rateLimiter, email_controller_1.verifyOTPAndResetPassword);
router.put("/change-password", rateLimiter_middleware_1.rateLimiter, email_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=email.routes.js.map