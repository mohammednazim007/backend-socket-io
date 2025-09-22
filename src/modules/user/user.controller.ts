import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getCurrentRelatedFriends,
  getCurrentUser,
  loginUser,
} from "./user.service";
import { getCookieOptions } from "../../utils/get-cookie-options";
import User from "./user.model";
import bcrypt from "bcryptjs";

// ** Register User with name, email and password
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
      user: result.user,
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
    const userId = (req as any).user?.id; // assume JWT middleware sets req.user
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, password } = req.body;
    const file = req.file as Express.Multer.File & {
      path?: string;
      filename?: string;
    };

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // update fields if provided
    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (file?.path) {
      user.avatar = file.path; // Cloudinary URL
    }

    await user.save();

    return res.status(201).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
