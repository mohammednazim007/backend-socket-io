"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map