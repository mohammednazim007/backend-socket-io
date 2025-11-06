// utils/cookieOptions.ts
export const getCookieOptions = (
  type: "access" | "refresh" = "access",
  rememberMe: boolean = false
) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Expiration durations
  const accessMaxAge = 15 * 60 * 1000; //✅ 15 minutes
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 //✅ 30 days if remember me
    : 7 * 24 * 60 * 60 * 1000; //✅ 7 days default

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/",
    signed: true,
    maxAge: type === "access" ? accessMaxAge : refreshMaxAge,
  };
};
