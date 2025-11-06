import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Auth Middleware: Verifies accessToken and refreshToken
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken =
      req.signedCookies?.accessToken ||
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    let refreshToken =
      req.signedCookies?.refreshToken ||
      req.cookies?.refreshToken ||
      req.headers["x-refresh-token"];

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    //✅ Verify access token
    try {
      const decoded = jwt.verify(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string
      ) as { id: string; iat?: number; exp?: number };

      req.user = decoded;
      return next();
    } catch (accessErr: any) {
      if (accessErr.name !== "TokenExpiredError") {
        return res
          .status(403)
          .json({ message: "Forbidden - Invalid access token" });
      }
    }

    // Access token expired, try refresh token
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No refresh token" });
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken!,
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: string; iat?: number; exp?: number };

      // Optionally issue a new access token
      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        signed: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      req.user = decodedRefresh;
      return next();
    } catch (refreshErr) {
      return res
        .status(403)
        .json({ message: "Forbidden - Invalid refresh token" });
    }
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
