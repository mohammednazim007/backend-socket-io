import { z } from "zod";

// Email and password regex constants
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().regex(emailRegex, "Please enter a valid email address"),
    password: z.string().regex(passwordRegex, "Password is too weak"),
    avatar: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, "Please enter a valid email address"),
    password: z.string().min(6, "Password is required"),
  }),
});

// Reuse the same names
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
