import mongoose, { Document } from "mongoose";
import { IUser } from "../../modules/user/user.interface";
export interface IUserDocument extends IUser, Document {
}
declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
export default User;
