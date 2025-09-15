// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

//** Auth Middleware for protecting routes

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Try to get token from cookie first, then from Authorization header
  let token = req.signedCookies?.authToken || req.cookies?.authToken;

  // Fallback to Authorization header if no cookie
  if (!token) {
    token = req.headers.authorization?.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as Express.Request["user"]; // ✅ cast to our custom type

    req.user = decoded; // ✅ no more TypeScript error
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
