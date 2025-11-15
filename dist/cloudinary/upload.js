"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("@/cloudinary/cloudinary"));
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        resource_type: "auto",
        transformation: [
            { width: 300, height: 300, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
        ],
    },
});
// ✅ Create reusable upload middleware
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            // ✅ Use 'null' instead of an Error object
            return cb(new multer_1.default.MulterError("LIMIT_UNEXPECTED_FILE"));
        }
        cb(null, true);
    },
});
//# sourceMappingURL=upload.js.map