import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "@/cloudinary/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder
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

export const upload = multer({ storage });
