import { Document, Model } from "mongoose";
export type OtpPurpose = "reset_password" | "verify_email";
export interface IOtp extends Document {
    email: string;
    otp: string;
    purpose: OtpPurpose;
    expiresAt: Date;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Otp: Model<IOtp>;
export default Otp;
