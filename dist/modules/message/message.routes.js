"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../../cloudinary-config/upload");
const message_controller_1 = require("../../modules/message/message.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// Send a message (text + image)
router.post("/send/:friend_id", auth_middleware_1.authMiddleware, upload_1.upload.single("media"), message_controller_1.sendMessage);
// Get chat history
// router.post("/get_message", authMiddleware, getChatHistory);
router.get("/get_message/:friend_id", auth_middleware_1.authMiddleware, message_controller_1.getChatHistory);
exports.default = router;
//# sourceMappingURL=message.routes.js.map