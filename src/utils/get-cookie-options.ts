// utils/cookieOptions.ts
export const getCookieOptions = (
  type: "access" | "refresh" = "access",
  rememberMe = false
) => {
  const isProduction = process.env.NODE_ENV === "production";

  // UPDATED: 15 days for access token
  const accessMaxAge = 15 * 24 * 60 * 60 * 1000; // 15 days

  const defaultRefreshMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const extendedRefreshMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

  const refreshMaxAge = rememberMe
    ? extendedRefreshMaxAge // 30 days
    : defaultRefreshMaxAge; // 7 days

  return {
    httpOnly: true,
    secure: isProduction, // must be true in production with HTTPS
    sameSite: "strict" as const, // ✅ allow cross-site cookies
    path: "/",
    signed: true,
    maxAge: type === "access" ? accessMaxAge : refreshMaxAge,
  };
};
