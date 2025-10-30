// src/modules/user/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model";
import { getCookieOptions } from "./get-cookie-options";

// 🔄 Refresh token route
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    );

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, getCookieOptions("access"));
    res.json({ message: "Token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
