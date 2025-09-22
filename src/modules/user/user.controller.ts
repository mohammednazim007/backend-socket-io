import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getCurrentRelatedFriends,
  getCurrentUser,
  loginUser,
  updateUserProfileImage,
} from "./user.service";
import { getCookieOptions } from "../../utils/get-cookie-options";

// ** Register User with name, email and password
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUser(name, email, password);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// ** Login User with email and password
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    // Set secure HTTP-only cookie with JWT token
    res.cookie("authToken", result.token, getCookieOptions());

    // Return user data without token (token is now in cookie)
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        // token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ** Logout User
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the auth cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

// ** Get Current User
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
    next(error);
  }
};

// ** Get All active related Friends
export const getRelatedFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const relatedFriend = await getCurrentRelatedFriends(
      req.user?.id as string
    );

    res
      .status(200)
      .json({ message: "Friends fetched successfully", relatedFriend });
  } catch (error) {
    next(error);
  }
};

//** profile image upload
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file as Express.Multer.File & {
      path?: string;
      filename?: string;
    };

    res.json({
      success: true,
      url: (file as any).path, // Cloudinary URL
      public_id: (file as any).filename, // Cloudinary public ID
    });
  } catch (error) {
    next(error);
  }
};
