import bcrypt from "bcryptjs";
import Otp from "./email.model";
import User from "../user/user.model";
import { sendEmail } from "@/config/resendEmail";
import { generateOTP } from "@/utils/generateOTP";

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
export const handleSendOtp = async (email: string) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Generate hash OTP
  const otpCode = generateOTP();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 5 minutes

  // Remove any previous OTPs for same email/purpose
  await Otp.deleteMany({ email, purpose: "reset_password" });

  // Store OTP in DB
  await Otp.create({
    email,
    otp: hashedOtp,
    purpose: "reset_password",
    expiresAt,
  });

  // Send OTP email
  await sendEmail(email, otpCode);

  return { email };
};

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
export const handleVerifyOtp = async (email: string, otpCode: string) => {
  if (!email || !otpCode) throw new Error("Email and OTP are required");

  const otpRecord = await Otp.findOne({ email, purpose: "reset_password" });
  if (!otpRecord) throw new Error("OTP not found");

  // Check expiration
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP has expired");
  }

  // Compare OTP (hashed)
  const isMatch = await bcrypt.compare(otpCode, otpRecord.otp);
  if (!isMatch) throw new Error("Invalid OTP");

  otpRecord.verified = true;
  await otpRecord.save();

  return { verified: true };
};

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
export const handleResetPassword = async (
  email: string,
  newPassword: string
) => {
  if (!email || !newPassword)
    throw new Error("Email and new password are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const verifiedOtp = await Otp.findOne({
    email,
    purpose: "reset_password",
    verified: true,
  });

  if (!verifiedOtp) throw new Error("OTP not verified");

  // Hash and update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Remove used OTP
  await Otp.deleteOne({ _id: verifiedOtp._id });

  return { email };
};
