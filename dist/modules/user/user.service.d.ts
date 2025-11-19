export declare const createUser: (name: string, email: string, password: string, avatar: string) => Promise<any>;
export declare const loginUser: (email: string, password: string) => Promise<{
    accessToken: string;
    user: any;
}>;
export declare const updateProfile: (userId: string, file?: Express.Multer.File & {
    path?: string;
    filename?: string;
}, currentPassword?: string, newPassword?: string, name?: string) => Promise<any>;
export declare const getCurrentUser: (userId: string) => Promise<any>;
