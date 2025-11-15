"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.verifyOTPAndResetPassword = exports.sendOTP = void 0;
const email_service_1 = require("@/modules/reset-password/email.service");
const email_validation_1 = require("@/modules/reset-password/email.validation");
const zod_1 = require("zod");
const handleZodError_1 = require("@/utils/handleZodError");
/// ============================================================
// ✅ ROUTE: POST /auth/send-otp
// PURPOSE:
//    - Generate and send a one-time password (OTP) to user's email
//      for password reset verification.
// ============================================================
const sendOTP = async (req, res, next) => {
    try {
        const { email } = email_validation_1.sendEmailValidation.parse(req.body);
        const result = await (0, email_service_1.handleSendOtp)(email);
        res.status(200).json({
            message: "OTP sent successfully",
            email: result?.email,
            success: true,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.sendOTP = sendOTP;
// ============================================================
// ✅ ROUTE: POST /auth/verify-otp
// PURPOSE:
//    - Verify the OTP sent to user's email before allowing password reset.
// ============================================================
const verifyOTPAndResetPassword = async (req, res, next) => {
    try {
        const { email, otpCode } = email_validation_1.verifyOtpValidation.parse(req.body);
        const result = await (0, email_service_1.handleVerifyOtp)(email, otpCode);
        res.status(200).json({
            message: "OTP verified successfully",
            verify: result.verified,
            success: true,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.verifyOTPAndResetPassword = verifyOTPAndResetPassword;
// ============================================================
// ✅ ROUTE: POST /auth/reset-password
// PURPOSE:
//    - Reset user's password after OTP verification is successful.
// ============================================================
const changePassword = async (req, res, next) => {
    try {
        const { email, newPassword } = email_validation_1.resetPasswordValidation.parse(req.body);
        const result = await (0, email_service_1.handleResetPassword)(email, newPassword);
        res.status(200).json({
            message: "Password reset successfully",
            user: result.email,
            success: true,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=email.controller.js.map