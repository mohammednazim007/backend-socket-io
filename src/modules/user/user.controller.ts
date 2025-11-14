import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getCurrentUser,
  loginUser,
  updateProfile,
} from "@/modules/user/user.service";
import { getCookieOptions } from "@/utils/get-cookie-options";
import { success, ZodError } from "zod";
import { handleZodError } from "@/utils/handleZodError";

// ============================================================
// ✅ ROUTE: POST /users/register
// PURPOSE:
//    - Register a new user with name, email, password, and optional avatar.
// CONTROLLER:
//    - `register` calls `createUser` service and returns created user.
// ============================================================
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, avatar } = req.body;
    const user = await createUser(name, email, password, avatar);

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: POST /users/login
// PURPOSE:
//    - Login user with email and password, set auth token in cookie.
// CONTROLLER:
//    - `login` calls `loginUser` service and returns user data (token in cookie).
// ============================================================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await loginUser(email, password);

    // Access token (short-lived)
    res.cookie("accessToken", result.accessToken, getCookieOptions("access"));

    // Refresh token (longer-lived if rememberMe is true)
    res.cookie(
      "refreshToken",
      result.refreshToken,
      getCookieOptions("refresh", rememberMe)
    );

    res.status(200).json({
      message: "Login successful",
      user: result.user,
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: GET /users/logout
// PURPOSE:
//    - Logout user by clearing the authentication cookie.
// CONTROLLER:
//    - `logout` clears the authToken cookie and returns a success message.
// ============================================================
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    // Clear both cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: GET /users/current-user
// PURPOSE:
//    - Get the currently logged-in user's information.
// CONTROLLER:
//    - `getCurrent` calls `getCurrentUser` service and returns user data.
// ============================================================
export const getCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getCurrentUser(req.user?.id as string);
    res
      .status(200)
      .json({ message: "Current user fetched successfully", user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(handleZodError(error));
    }
    next(error);
  }
};

// ============================================================
// ✅ ROUTE: POST /users/profile
// PURPOSE:
//    - Update logged-in user's profile, including optional profile image and password.
// PARAMS:
//    - `name`, `currentPassword`, `newPassword` from request body.
//    - `file` from uploaded image (optional).
// CONTROLLER:
//    - `updateUserProfile` calls `updateProfile` service and returns updated user.
// ============================================================
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, currentPassword, newPassword } = req.body;
    const file = req.file as Express.Multer.File & {
      path?: string;
      filename?: string;
    };

    const user = await updateProfile(
      userId,
      file,
      currentPassword,
      newPassword,
      name
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
