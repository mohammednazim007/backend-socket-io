"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("@/modules/user/user.model"));
const get_cookie_options_1 = require("@/utils/get-cookie-options");
// 🔄 Refresh token route
const refreshToken = async (req, res, next) => {
    const token = req.signedCookies.refreshToken;
    if (!token)
        return res.status(401).json({ message: "No refresh token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await user_model_1.default.findById(decoded.id);
        if (!user)
            return res.status(401).json({ message: "User not found" });
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "30d" });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        res.cookie("accessToken", newAccessToken, (0, get_cookie_options_1.getCookieOptions)("access"));
        res.cookie("refreshToken", newRefreshToken, (0, get_cookie_options_1.getCookieOptions)("refresh"));
        res.status(200).json({ message: "Tokens refreshed successfully" });
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=refreshToken.js.map