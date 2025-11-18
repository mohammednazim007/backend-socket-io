// src/utils/get-cookie-options.ts
import { CookieOptions } from "express";

export const getCookieOptions = (
  type: "access" | "refresh" = "access",
  rememberMe = false
): CookieOptions => {
  const isProd = process.env.NODE_ENV === "production";

  const accessMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    path: "/",
    signed: false,
    domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: type === "access" ? accessMaxAge : refreshMaxAge,
  };
};
