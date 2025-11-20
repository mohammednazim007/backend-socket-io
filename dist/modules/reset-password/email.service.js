"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetPassword = exports.handleVerifyOtp = exports.handleSendOtp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const email_model_1 = __importDefault(require("./email.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const resendEmail_1 = require("../../config/resendEmail");
const generateOTP_1 = require("../../utils/generateOTP");
/* ============================================================
✅ SERVICE: handleSendOtp
PURPOSE:
   - Generate and send a one-time password (OTP) to user's email
     for password reset verification.
FLOW:
   1️⃣ Validate if the email exists in the user collection.
   2️⃣ Generate a 6-digit OTP code and hash it using bcrypt.
   3️⃣ Remove any existing OTPs for the same email/purpose.
   4️⃣ Store new OTP with 5-minute expiry.
   5️⃣ Send OTP to user's email using mail service.
============================================================ */
const handleSendOtp = async (email) => {
    if (!email)
        throw new Error("Email is required");
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new Error("User not found");
    // Generate hash OTP
    const otpCode = (0, generateOTP_1.generateOTP)();
    const hashedOtp = await bcryptjs_1.default.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 5 minutes
    // Remove any previous OTPs for same email/purpose
    await email_model_1.default.deleteMany({ email, purpose: "reset_password" });
    // Store OTP in DB
    await email_model_1.default.create({
        email,
        otp: hashedOtp,
        purpose: "reset_password",
        expiresAt,
    });
    // Send OTP email
    await (0, resendEmail_1.sendEmail)(email, otpCode);
    return { email };
};
exports.handleSendOtp = handleSendOtp;
/* ============================================================
✅ SERVICE: handleVerifyOtp
PURPOSE:
   - Verify if the provided OTP matches the stored hashed OTP.
FLOW:
   1️⃣ Validate that email and OTP are provided.
   2️⃣ Fetch the OTP record from the database.
   3️⃣ Check if the OTP is expired.
   4️⃣ Compare provided OTP with hashed one using bcrypt.
   5️⃣ Mark OTP record as verified if matched.
============================================================ */
const handleVerifyOtp = async (email, otpCode) => {
    if (!email || !otpCode)
        throw new Error("Email and OTP are required");
    const otpRecord = await email_model_1.default.findOne({ email, purpose: "reset_password" });
    if (!otpRecord)
        throw new Error("OTP not found");
    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
        await email_model_1.default.deleteOne({ _id: otpRecord._id });
        throw new Error("OTP has expired");
    }
    // Compare OTP (hashed)
    const isMatch = await bcryptjs_1.default.compare(otpCode, otpRecord.otp);
    if (!isMatch)
        throw new Error("Invalid OTP");
    otpRecord.verified = true;
    await otpRecord.save();
    return { verified: true };
};
exports.handleVerifyOtp = handleVerifyOtp;
/* ============================================================
✅ SERVICE: handleResetPassword
PURPOSE:
   - Reset user's password securely after OTP verification.
FLOW:
   1️⃣ Validate input parameters (email, new password).
   2️⃣ Ensure the user exists.
   3️⃣ Confirm that a verified OTP record exists.
   4️⃣ Hash the new password with bcrypt.
   5️⃣ Save the new password and delete the used OTP record.
============================================================ */
const handleResetPassword = async (email, newPassword) => {
    if (!email || !newPassword)
        throw new Error("Email and new password are required");
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const verifiedOtp = await email_model_1.default.findOne({
        email,
        purpose: "reset_password",
        verified: true,
    });
    if (!verifiedOtp)
        throw new Error("OTP not verified");
    // Hash and update password
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    // Remove used OTP
    await email_model_1.default.deleteOne({ _id: verifiedOtp._id });
    return { email };
};
exports.handleResetPassword = handleResetPassword;
//# sourceMappingURL=email.service.js.map