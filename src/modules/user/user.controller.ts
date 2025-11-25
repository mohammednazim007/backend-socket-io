import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getCurrentUser,
  loginUser,
  updateProfile,
} from "@/modules/user/user.service";
import { ZodError } from "zod";
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

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
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
//    - Login user with email and password, return user data and auth token.

// ============================================================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
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
    res.status(200).json({
      success: true,
      message: "Logout successful. ",
    });
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
    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      user,
    });
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
// export const updateUserProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = (req as any).user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const { name, role, location, website, bio, twitter, github, linkedin } =
//       req.body;
//     const file = req.file as Express.Multer.File & {
//       path?: string;
//       filename?: string;
//     };

//     const updateFields={
//       name,
//       role,
//       location,
//       website,
//       bio,
//       twitter,
//       github,
//       linkedin,
//       file
//     }

//     const user = await updateProfile(updateFields);

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       user,
//       success: true,
//     });
//   } catch (error: unknown) {
//     const message =
//       error instanceof Error ? error.message : "Something went wrong";
//     res.status(400).json({ message, success: false });
//   }
// };

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

    const { name, role, location, website, bio, twitter, github, linkedin } =
      req.body;

    const file = req.file as
      | (Express.Multer.File & { path?: string; filename?: string })
      | undefined;

    const updateData = {
      name,
      role,
      location,
      website,
      bio,
      twitter,
      github,
      linkedin,
      file,
    };

    const updatedUser = await updateProfile(userId, updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return res.status(400).json({ success: false, message });
  }
};
