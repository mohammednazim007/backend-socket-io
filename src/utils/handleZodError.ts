import { ZodError } from "zod";

export const handleZodError = (error: ZodError) => {
  return {
    success: false,
    message: "Validation failed",
    errors: error.issues.map((err) => err.message),
  };
};
