"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityValidation = void 0;
const zod_1 = require("zod");
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
exports.securityValidation = zod_1.z.object({
    phone: zod_1.z.string().regex(phoneRegex, "Invalid phone number"),
    currentPassword: zod_1.z
        .string()
        .optional()
        .refine((val) => !val || passwordRegex.test(val), "Password is too weak"),
    confirmPassword: zod_1.z.string().optional(),
    twoFactorEnabled: zod_1.z.boolean(),
    lastPasswordChange: zod_1.z.date().optional(),
});
//# sourceMappingURL=profile.validation.js.map