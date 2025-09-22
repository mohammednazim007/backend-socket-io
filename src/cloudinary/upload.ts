import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  } as {
    folder: string;
    allowed_formats: string[];
  },
});

export const upload = multer({ storage });
