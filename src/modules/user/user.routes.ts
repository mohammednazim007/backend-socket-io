import express, { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateUserProfile,
} from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "./user.validation";
import { upload } from "../../cloudinary/upload";

const router: Router = express.Router();

//**  Public routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

//**  Protected routes (require authentication)
router.get("/current-user", authMiddleware, getCurrent);
router.post(
  "/profile",
  authMiddleware,
  upload.single("image"),
  updateUserProfile
);
router.get("/logout", logout);

export default router;
