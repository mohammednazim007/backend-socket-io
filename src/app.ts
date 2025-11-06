// src/app.ts
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "@/modules/user/user.routes";
import messageRoutes from "@/modules/message/message.routes";
import friendRoutes from "@/modules/friend/friend.routes";
import resetRoute from "@/modules/reset-password/email.routes";
import { errorHandler } from "@/middlewares/error.middleware";
import { healthRoute } from "@/middlewares/healthMiddleware";

const app: Application = express();

// CORS configuration for cookie support
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Allowed headers
  })
);

// Cookie parser middleware with secure settings
app.use(cookieParser(process.env.COOKIE_SECRET || "fallback-secret-key"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global health route
app.get("/health", healthRoute);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", resetRoute);

app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/friend", friendRoutes);

// Global Health & Error Handler
app.use(errorHandler);

export default app;
