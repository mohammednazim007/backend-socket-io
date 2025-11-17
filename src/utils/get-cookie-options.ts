export const getCookieOptions = (
  type: "access" | "refresh" = "access",
  rememberMe = false
) => {
  const isProduction = process.env.NODE_ENV === "production";

  const accessMaxAge = 15 * 24 * 60 * 60 * 1000; // 15 days
  const defaultRefreshMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const extendedRefreshMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

  const refreshMaxAge = rememberMe
    ? extendedRefreshMaxAge
    : defaultRefreshMaxAge;

  return {
    httpOnly: true,
    secure: isProduction, // Only HTTPS in production
    sameSite: isProduction ? ("none" as const) : ("lax" as const), // Cross-site cookies
    path: "/",
    signed: true,
    domain: ".onrender.com",
    maxAge: type === "access" ? accessMaxAge : refreshMaxAge,
  };
};
