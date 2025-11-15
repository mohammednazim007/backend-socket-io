export declare const getCookieOptions: (type?: "access" | "refresh", rememberMe?: boolean) => {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict";
    path: string;
    signed: boolean;
    maxAge: number;
};
