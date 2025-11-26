"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSecurity = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateProfileSecurity = async (userId, data) => {
    const { phone, currentPassword, confirmPassword, twoFactorEnabled } = data;
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error("User not found.");
    const updates = {};
    // --- Password change logic ---
    if (currentPassword && confirmPassword) {
        const isPasswordMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordMatch)
            throw new Error("Invalid current password.");
        updates.password = await bcryptjs_1.default.hash(confirmPassword, 10);
        updates.lastPasswordChange = new Date();
    }
    // --- Update phone ALWAYS ---
    if (phone)
        updates.phone = phone;
    // --- Update 2FA ONLY if provided ---
    if (typeof twoFactorEnabled === "boolean") {
        updates.twoFactorEnabled = Boolean(twoFactorEnabled);
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select("-password");
    if (!updatedUser)
        throw new Error("Failed to update user security settings.");
    return updatedUser;
};
exports.updateProfileSecurity = updateProfileSecurity;
//# sourceMappingURL=profile.service.js.map