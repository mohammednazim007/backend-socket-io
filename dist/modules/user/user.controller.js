"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getCurrent = exports.logout = exports.login = exports.register = void 0;
const user_service_1 = require("../../modules/user/user.service");
const get_cookie_options_1 = require("../../utils/get-cookie-options");
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
        res.status(201).json(user);
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
//    - Login user with email and password, set auth token in cookie.
// CONTROLLER:
//    - `login` calls `loginUser` service and returns user data (token in cookie).
// ============================================================
const login = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;
        const result = await (0, user_service_1.loginUser)(email, password);
        // Access token (short-lived)
        res.cookie("accessToken", result.accessToken, (0, get_cookie_options_1.getCookieOptions)("access"));
        // Refresh token (longer-lived if rememberMe is true)
        res.cookie("refreshToken", result.refreshToken, (0, get_cookie_options_1.getCookieOptions)("refresh", rememberMe));
        res.status(200).json({
            message: "Login successful",
            user: result.user,
            success: true,
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
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        };
        // Clear both cookies
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
        res.status(200).json({ message: "Logout successful" });
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
        res
            .status(200)
            .json({ message: "Current user fetched successfully", user });
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
        const { name, currentPassword, newPassword } = req.body;
        const file = req.file;
        const user = await (0, user_service_1.updateProfile)(userId, file, currentPassword, newPassword, name);
        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map