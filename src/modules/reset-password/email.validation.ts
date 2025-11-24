import { z } from "zod";

// For generating or sending OTP
export const sendEmailValidation = z.object({
  email: z.string().email("Invalid email address"),
});

// For verifying OTP and resetting password
export const validation_otp = z.object({
  email: z.string().email("Invalid email address"),
  otpCode: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

// For resetting password
export const resetPasswordValidation = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SendEmailInput = z.infer<typeof sendEmailValidation>;
export type VerifyOtpInput = z.infer<typeof validation_otp>;
export type ResetPasswordInput = z.infer<typeof resetPasswordValidation>;
