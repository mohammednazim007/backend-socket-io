"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("./profile.controller");
const router = express_1.default.Router();
router.put("/security", auth_middleware_1.authMiddleware, profile_controller_1.updateSecurityController);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map