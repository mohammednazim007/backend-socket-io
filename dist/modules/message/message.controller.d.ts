import { Request, Response } from "express";
export declare const sendMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getChatHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
