import { IUpdateProfile } from "./user.interface";
export declare const createUser: (name: string, email: string, password: string, avatar: string) => Promise<any>;
export declare const loginUser: (email: string, password: string) => Promise<{
    accessToken: string;
    user: any;
}>;
export declare const updateProfile: (userId: string, data: IUpdateProfile) => Promise<any>;
export declare const getCurrentUser: (userId: string) => Promise<any>;
