"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Auth Middleware: Verifies accessToken and refreshToken
 */
const authMiddleware = (req, res, next) => {
    try {
        let accessToken = req.signedCookies?.accessToken ||
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];
        let refreshToken = req.signedCookies?.refreshToken ||
            req.cookies?.refreshToken ||
            req.headers["x-refresh-token"];
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        //✅ Verify access token
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            req.user = decoded;
            return next();
        }
        catch (accessErr) {
            if (accessErr.name !== "TokenExpiredError") {
                return res
                    .status(403)
                    .json({ message: "Forbidden - Invalid access token" });
            }
        }
        // Access token expired, try refresh token
        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No refresh token" });
        }
        try {
            const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            // Optionally issue a new access token
            const newAccessToken = jsonwebtoken_1.default.sign({ id: decodedRefresh.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                signed: true,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            req.user = decodedRefresh;
            return next();
        }
        catch (refreshErr) {
            return res
                .status(403)
                .json({ message: "Forbidden - Invalid refresh token" });
        }
    }
    catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map