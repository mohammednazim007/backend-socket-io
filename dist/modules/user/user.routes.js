"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../modules/user/user.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const user_validation_1 = require("../../modules/user/user.validation");
const upload_1 = require("../../cloudinary-config/upload");
const refreshToken_1 = require("../../utils/refreshToken");
const router = express_1.default.Router();
//** Public routes
// Register a new user
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.registerSchema), user_controller_1.register);
// Login user and return token
router.post("/login", (0, validateRequest_1.validateRequest)(user_validation_1.loginSchema), user_controller_1.login);
router.post("/refresh-token", refreshToken_1.refreshToken);
//** Protected routes (require authentication)
// Get currently logged-in user
router.get("/current-user", auth_middleware_1.authMiddleware, user_controller_1.getCurrent);
// ** Update user profile with optional image
router.post("/profile", auth_middleware_1.authMiddleware, upload_1.upload.single("image"), user_controller_1.updateUserProfile);
//**  Logout user
router.get("/logout", user_controller_1.logout);
exports.default = router;
//# sourceMappingURL=user.routes.js.map