import { Request, Response, NextFunction } from "express";
import {
  handleSendOtp,
  handleVerifyOtp,
  handleResetPassword,
} from "@/modules/reset-password/email.service";
import {
  resetPasswordValidation,
  sendEmailValidation,
  verifyOtpValidation,
} from "@/modules/reset-password/email.validation";
import { success, ZodError } from "zod";
import { handleZodError } from "@/utils/handleZodError";

/// ============================================================
// ✅ ROUTE: POST /auth/send-otp
// PURPOSE:
//    - Generate and send a one-time password (OTP) to user's email
//      for password reset verification.
// ============================================================
export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = sendEmailValidation.parse(req.body);
    const result = await handleSendOtp(email);

    res.status(200).json({
      message: "OTP sent successfully",
      email: result?.email,
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: POST /auth/verify-otp
// PURPOSE:
//    - Verify the OTP sent to user's email before allowing password reset.
// ============================================================
export const verifyOTPAndResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otpCode } = verifyOtpValidation.parse(req.body);
    const result = await handleVerifyOtp(email, otpCode);

    res.status(200).json({
      message: "OTP verified successfully",
      verify: result.verified,
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: POST /auth/reset-password
// PURPOSE:
//    - Reset user's password after OTP verification is successful.
// ============================================================
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = resetPasswordValidation.parse(req.body);
    const result = await handleResetPassword(email, newPassword);

    res.status(200).json({
      message: "Password reset successfully",
      user: result.email,
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};
