import express, { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateUserProfile,
} from "@/modules/user/user.controller";
import { validateRequest } from "@/middlewares/validateRequest";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { loginSchema, registerSchema } from "@/modules/user/user.validation";
import { upload } from "@/cloudinary/upload";
import { refreshToken } from "@/utils/refreshToken";

const router: Router = express.Router();

//** Public routes
// Register a new user
router.post("/register", validateRequest(registerSchema), register);

// Login user and return token
router.post("/login", validateRequest(loginSchema), login);

router.post("/refresh-token", refreshToken);

//** Protected routes (require authentication)
// Get currently logged-in user
router.get("/current-user", authMiddleware, getCurrent);

// Update user profile with optional image
router.post(
  "/profile",
  authMiddleware,
  upload.single("image"),
  updateUserProfile
);

// Logout user
router.get("/logout", logout);

export default router;
