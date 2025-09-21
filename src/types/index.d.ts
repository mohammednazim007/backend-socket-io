import "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
