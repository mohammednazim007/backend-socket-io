import { z } from "zod";
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

export const securityValidation = z.object({
  phone: z.string().optional(),
  currentPassword: z.string().regex(passwordRegex, "Password is too weak"),
  twoFactorEnabled: z.boolean().optional(),
  confirmPassword: z.string().optional(),
  lastPasswordChange: z.date().optional(),
});

export type SecuritySchemaType = z.infer<typeof securityValidation>;
