import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IUser } from "@/modules/user/user.interface";

// IUser no longer has _id
export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    role: { type: String, default: null },
    location: { type: String, default: null },
    bio: { type: String, default: null },
    phone: { type: String, default: null },
    website: { type: String, default: null },

    twitter: { type: String, default: null },
    github: { type: String, default: null },
    linkedin: { type: String, default: null },

    marketingEmails: { type: Boolean, default: false },
    securityEmails: { type: Boolean, default: false },
    productUpdates: { type: Boolean, default: false },

    friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],

    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.models.User || model<IUserDocument>("User", userSchema);

export default User;
