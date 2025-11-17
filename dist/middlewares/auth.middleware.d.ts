import { Request, Response, NextFunction } from "express";
/**
 * Auth Middleware: Verifies accessToken and refreshToken
 */
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
