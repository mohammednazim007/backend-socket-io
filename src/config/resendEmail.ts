import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { emailOtpTemplate } from "@/email-html-templete/emailTemplete";
dotenv.config();

export const sendEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: `"Official Chat" <${process.env.USER_EMAIL}>`,
    to: [email],
    subject: `Hello, Your OTP Code`,
    text: `Your OTP will be expire in 5 minutes.`,
    html: emailOtpTemplate(otp),
  };

  await transporter.sendMail(mailOptions);
};
