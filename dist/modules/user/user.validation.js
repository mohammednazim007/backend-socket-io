"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Email and password regex constants
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters long"),
        email: zod_1.z.string().regex(emailRegex, "Please enter a valid email address"),
        password: zod_1.z.string().regex(passwordRegex, "Password is too weak"),
        avatar: zod_1.z.string().optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().regex(emailRegex, "Please enter a valid email address"),
        password: zod_1.z.string().min(6, "Password is required"),
    }),
});
//# sourceMappingURL=user.validation.js.map