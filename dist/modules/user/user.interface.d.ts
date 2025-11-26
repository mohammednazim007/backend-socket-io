export interface IUser {
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    role?: string;
    location?: string;
    bio?: string;
    phone?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    marketingEmails?: boolean;
    securityEmails?: boolean;
    productUpdates?: boolean;
    twoFactorEnabled?: boolean;
    lastPasswordChange?: Date;
    isFriend?: boolean;
    friends?: string[];
    friendRequests?: string[];
    sentRequests?: string[];
    blockedUsers?: string[];
    lastActive?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface IUpdateProfile {
    name?: string;
    role?: string;
    location?: string;
    website?: string;
    bio?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    file?: Express.Multer.File & {
        path?: string;
        filename?: string;
    };
}
