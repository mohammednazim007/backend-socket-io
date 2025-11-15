"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.updateProfile = exports.loginUser = exports.createUser = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ============================================================
// ✅ METHOD: POST
// ✅ SERVICE: createUser
// PURPOSE:
//    - Create a new user with name, email, password, and optional avatar.
// CONTROLLER:
//    - Called by `register` in `user.controller.ts` to register a new user.
// ============================================================
const createUser = async (name, email, password, avatar) => {
    const userExists = await user_model_1.default.findOne({ email });
    if (userExists)
        throw new Error("User with this email already exists");
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.default.create({
        name,
        email,
        avatar: "",
        password: hashedPassword,
    });
    return user;
};
exports.createUser = createUser;
// ============================================================
// ✅ METHOD: POST
// ✅ SERVICE: loginUser
// PURPOSE:
//    - Authenticate user with email and password, and return JWT token.
// CONTROLLER:
//    - Called by `login` in `user.controller.ts` to log in a user.
// ============================================================
const loginUser = async (email, password) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new Error("User not found with this credentials");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "30d" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    //✅ Update user last active timestamp
    user.lastActive = new Date();
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    return { accessToken, refreshToken, user: userObj };
};
exports.loginUser = loginUser;
// ============================================================
// ✅ METHOD: POST
// ✅ SERVICE: updateProfile
// PURPOSE:
//    - Update user's profile data: name, password, and optional avatar.
// PARAMS:
//    - `file`: uploaded profile image (optional)
//    - `currentPassword`, `newPassword`: for password change (optional)
//    - `name`: updated name (optional)
// CONTROLLER:
//    - Called by `updateUserProfile` in `user.controller.ts`
// ============================================================
const updateProfile = async (userId, file, currentPassword, newPassword, name) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (name)
        user.name = name;
    if (currentPassword && newPassword) {
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            throw new Error("Current password is incorrect");
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
    }
    if (file?.path)
        user.avatar = file.path;
    await user.save();
    return user;
};
exports.updateProfile = updateProfile;
// ============================================================
// ✅ METHOD: GET
// ✅ SERVICE: getCurrentUser
// PURPOSE:
//    - Fetch the current user by ID, excluding password.
// CONTROLLER:
//    - Called by `getCurrent` in `user.controller.ts`
// ============================================================
const getCurrentUser = async (userId) => {
    const user = await user_model_1.default.findById(userId).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=user.service.js.map