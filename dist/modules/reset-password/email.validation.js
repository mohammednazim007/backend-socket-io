"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.verifyOtpValidation = exports.sendEmailValidation = void 0;
const zod_1 = require("zod");
// For generating or sending OTP
exports.sendEmailValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
// For verifying OTP and resetting password
exports.verifyOtpValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    otpCode: zod_1.z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only digits"),
});
// For resetting password
exports.resetPasswordValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    newPassword: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
//# sourceMappingURL=email.validation.js.map