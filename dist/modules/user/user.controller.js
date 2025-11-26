"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getCurrent = exports.logout = exports.login = exports.register = void 0;
const user_service_1 = require("../../modules/user/user.service");
const zod_1 = require("zod");
const handleZodError_1 = require("../../utils/handleZodError");
// ============================================================
// ✅ ROUTE: POST /users/register
// PURPOSE:
//    - Register a new user with name, email, password, and optional avatar.
// CONTROLLER:
//    - `register` calls `createUser` service and returns created user.
// ============================================================
const register = async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;
        const user = await (0, user_service_1.createUser)(name, email, password, avatar);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.register = register;
// ============================================================
// ✅ ROUTE: POST /users/login
// PURPOSE:
//    - Login user with email and password, return user data and auth token.
// ============================================================
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, user_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user,
            accessToken: result.accessToken,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.login = login;
// ============================================================
// ✅ ROUTE: GET /users/logout
// PURPOSE:
//    - Logout user by clearing the authentication cookie.
// CONTROLLER:
//    - `logout` clears the authToken cookie and returns a success message.
// ============================================================
const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout successful. ",
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.logout = logout;
// ============================================================
// ✅ ROUTE: GET /users/current-user
// PURPOSE:
//    - Get the currently logged-in user's information.
// CONTROLLER:
//    - `getCurrent` calls `getCurrentUser` service and returns user data.
// ============================================================
const getCurrent = async (req, res, next) => {
    try {
        const user = await (0, user_service_1.getCurrentUser)(req.user?.id);
        res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.getCurrent = getCurrent;
// ============================================================
// ✅ ROUTE: POST /users/profile
// PURPOSE:
//    - Update logged-in user's profile, including optional profile image and password.
// PARAMS:
//    - `name`, `currentPassword`, `newPassword` from request body.
//    - `file` from uploaded image (optional).
// CONTROLLER:
//    - `updateUserProfile` calls `updateProfile` service and returns updated user.
// ============================================================
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { name, role, location, website, bio, twitter, github, linkedin } = req.body;
        const file = req.file;
        const updateData = {
            name,
            role,
            location,
            website,
            bio,
            twitter,
            github,
            linkedin,
            file,
        };
        const updatedUser = await (0, user_service_1.updateProfile)(userId, updateData);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return res.status(400).json({ success: false, message });
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map