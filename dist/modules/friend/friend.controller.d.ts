import { Request, Response } from "express";
export declare const getAllNonFriendUsers: (req: Request, res: Response) => Promise<void>;
export declare const getAllRequestedFriend: (req: Request, res: Response) => Promise<void>;
export declare const sendFriendRequest: (req: Request, res: Response) => Promise<void>;
export declare const getAcceptedFriend: (req: Request, res: Response) => Promise<void>;
export declare const cancelFriendRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelFriendRequestByMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const acceptFriendRequest: (req: Request, res: Response) => Promise<void>;
