// utils/cookieOptions.ts
export const getCookieOptions = (
  type: "access" | "refresh" = "access",
  rememberMe = false
) => {
  const isProduction = process.env.NODE_ENV === "production";

  const accessMaxAge = 5 * 60 * 1000; // 15 minutes
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  return {
    httpOnly: true,
    secure: isProduction, // must be true in production with HTTPS
    sameSite: "strict" as const, // ✅ allow cross-site cookies
    path: "/",
    signed: true,
    maxAge: type === "access" ? accessMaxAge : refreshMaxAge,
  };
};
