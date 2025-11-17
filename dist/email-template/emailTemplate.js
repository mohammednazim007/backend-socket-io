"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailOtpTemplate = void 0;
const emailOtpTemplate = (otp) => {
    return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f8fa; padding: 40px 0; margin: 0;">
    <div style="max-width: 600px; background-color: #ffffff; border-radius: 10px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4F46E5, #6366F1); color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">Developer</h1>
      </div>

      <!-- Body -->
      <div style="padding: 32px; color: #333333;">
        <h2 style="font-weight: 600; font-size: 20px;">Your Verification Code</h2>
        <p style="font-size: 15px; color: #555;">
          Please use the following one-time password (OTP) to verify your identity. 
          This code is valid for <strong>5 minutes</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #f4f5ff; border: 1px dashed #4F46E5; border-radius: 10px; padding: 16px 24px;">
            <span style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 6px;">${otp}</span>
          </div>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 24px;">
          If you didn’t request this code, please ignore this email. Your account is safe.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f2f6; text-align: center; padding: 16px; font-size: 13px; color: #999;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Official Chat. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
};
exports.emailOtpTemplate = emailOtpTemplate;
//# sourceMappingURL=emailTemplate.js.map