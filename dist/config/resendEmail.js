"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const emailTemplate_1 = require("../email-template/emailTemplate");
dotenv_1.default.config();
const sendEmail = async (email, otp) => {
    const transporter = nodemailer_1.default.createTransport({
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
        html: (0, emailTemplate_1.emailOtpTemplate)(otp),
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=resendEmail.js.map