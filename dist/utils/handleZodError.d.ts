import { ZodError } from "zod";
export declare const handleZodError: (error: ZodError) => {
    success: boolean;
    message: string;
    errors: string[];
};
