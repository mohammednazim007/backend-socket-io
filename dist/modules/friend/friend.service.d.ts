export declare const sendRequest: (senderId: string, receiverId: string) => Promise<{
    message: string;
    data: {
        sender: any;
        receiver: any;
    };
}>;
export declare const acceptedFriend: (userId: string) => Promise<{
    message: string;
    users: any;
}>;
export declare const getRequestedFriend: (userId: string) => Promise<{
    message: string;
    users: any;
}>;
export declare const getNonFriendUsers: (userId: string) => Promise<{
    message: string;
    users: any[];
}>;
export declare const cancelRequest: (senderId: string, receiverId: string) => Promise<{
    message: string;
    data: {
        sender: any;
        receiver: any;
    };
}>;
export declare const cancelRequestByMe: (userId: string, friendId: string) => Promise<{
    message: string;
    data: {
        sender: any;
        receiver: any;
    };
}>;
export declare const acceptRequest: (senderId: string, receiverId: string) => Promise<{
    message: string;
    user: {
        sender: any;
        receiver: any;
    };
}>;
