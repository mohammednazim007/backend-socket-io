import express, { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  getRelatedFriends,
} from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "./user.validation";
import { upload } from "../../middlewares/multer.middleware";

const router: Router = express.Router();

//**  Public routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

//**  Protected routes (require authentication)
router.get("/current-user", authMiddleware, getCurrent);
router.get("/related-friends/:id", authMiddleware, getRelatedFriends);
router.get("/profile", authMiddleware, upload.single("image"));
router.get("/logout", logout);

export default router;
