export type LoginRequest = {
    username: string;
    password: string;
}

export type TokenPair = {
    accessToken: string;
    refreshToken: string;
    accessExpiresAt: number;
    refreshExpiresAt: number;
}

export type AuthState = {
    status: "anonymous" | "authenticated";
    tokens?: TokenPair;
}