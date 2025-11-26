import { z } from "zod";
export declare const securityValidation: z.ZodObject<{
    phone: z.ZodString;
    currentPassword: z.ZodOptional<z.ZodString>;
    confirmPassword: z.ZodOptional<z.ZodString>;
    twoFactorEnabled: z.ZodBoolean;
    lastPasswordChange: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export type SecuritySchemaType = z.infer<typeof securityValidation>;
