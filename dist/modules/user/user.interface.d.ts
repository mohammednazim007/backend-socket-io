export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    friends: string[];
    friendRequests: string[];
    sentRequests: string[];
    blockedUsers: string[];
    lastActive?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
