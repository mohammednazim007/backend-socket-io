export declare const handleSendOtp: (email: string) => Promise<{
    email: string;
}>;
export declare const handleVerifyOtp: (email: string, otpCode: string) => Promise<{
    verified: boolean;
}>;
export declare const handleResetPassword: (email: string, newPassword: string) => Promise<{
    email: string;
}>;
