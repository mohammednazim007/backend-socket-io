export declare const getCookieOptions: (type?: "access" | "refresh", rememberMe?: boolean) => {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    path: string;
    signed: boolean;
    maxAge: number;
    domain: string | undefined;
};
