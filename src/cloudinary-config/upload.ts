import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "@/cloudinary-config/cloudinary-config";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    resource_type: "auto",
    transformation: [
      { width: 300, height: 300, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  } as {
    folder: string;
    allowed_formats: string[];
    resource_type: string;
  },
});

// ✅ Create reusable upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      // ✅ Use 'null' instead of an Error object
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
    }
    cb(null, true);
  },
});
