import { z } from "zod";
export declare const sendEmailValidation: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const validation_otp: z.ZodObject<{
    email: z.ZodString;
    otpCode: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordValidation: z.ZodObject<{
    email: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type SendEmailInput = z.infer<typeof sendEmailValidation>;
export type VerifyOtpInput = z.infer<typeof validation_otp>;
export type ResetPasswordInput = z.infer<typeof resetPasswordValidation>;
