import User from "../user/user.model";
import bcrypt from "bcryptjs";
import { SecuritySchemaType } from "./profile.validation";

export const updateProfileSecurity = async (
  userId: string,
  data: SecuritySchemaType
) => {
  const { phone, currentPassword, confirmPassword, twoFactorEnabled } = data;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error({
      message: "User not found.",
      success: false,
    } as unknown as string);
  }

  // Build updates object with full type safety
  const updates: Partial<{
    phone: string;
    password: string;
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
  }> = {};

  // If user wants to change password

  if (!currentPassword || !confirmPassword) {
    throw new Error({
      message: "Password is required to change.",
      success: false,
    } as unknown as string);
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid current password.");
  }

  updates.password = await bcrypt.hash(confirmPassword, 10);
  updates.phone = phone;
  updates.lastPasswordChange = new Date();

  // Update 2FA
  if (typeof twoFactorEnabled === "boolean") {
    updates.twoFactorEnabled = twoFactorEnabled;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new Error({
      message: "Failed to update user security settings.",
      success: false,
    } as unknown as string);
  }

  return updatedUser;
};
