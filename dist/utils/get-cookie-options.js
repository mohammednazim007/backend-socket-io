"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieOptions = void 0;
// src/utils/get-cookie-options.ts
const getCookieOptions = (type = "access", rememberMe = false) => {
    const accessMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    const refreshMaxAge = rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd, // HTTPS only in production
        sameSite: isProd ? "none" : "lax", // allow cross-site cookies in production
        path: "/",
        signed: false, // ❗ MUST be false for cross-domain
        maxAge: type === "access" ? accessMaxAge : refreshMaxAge,
        domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    };
};
exports.getCookieOptions = getCookieOptions;
//# sourceMappingURL=get-cookie-options.js.map