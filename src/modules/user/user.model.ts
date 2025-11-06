import mongoose, { Schema } from "mongoose";
import { IUser } from "@/modules/user/user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },

    friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],

    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
