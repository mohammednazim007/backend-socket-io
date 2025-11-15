"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("@/modules/user/user.routes"));
const message_routes_1 = __importDefault(require("@/modules/message/message.routes"));
const friend_routes_1 = __importDefault(require("@/modules/friend/friend.routes"));
const email_routes_1 = __importDefault(require("@/modules/reset-password/email.routes"));
const error_middleware_1 = require("@/middlewares/error.middleware");
const app = (0, express_1.default)();
// CORS configuration for cookie support
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Allowed headers
}));
// Cookie parser middleware with secure settings
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || "fallback-secret-key"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Global health route
app.get("/", (req, res) => {
    res.send("Server is running ✅");
});
// Routes
app.use("/api/v1/user", user_routes_1.default);
app.use("/api/v1/auth", email_routes_1.default);
app.use("/api/v1/message", message_routes_1.default);
app.use("/api/v1/friend", friend_routes_1.default);
// Global Health & Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map