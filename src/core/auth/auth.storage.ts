import type { TokenPair } from "./auth.models";

const KEYS = {
    access: "access_token",
    refresh: "refresh_token",
    accessExpiresAt: "access_expires_at",
    refreshExpiresAt: "refresh_expires_at",
} as const;

function toNumber(value: string | null): number | undefined {
    if (!value) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}

export function loadTokens(): TokenPair | undefined {
    const accessToken = localStorage.getItem(KEYS.access) ?? undefined;
    const refreshToken = localStorage.getItem(KEYS.refresh) ?? undefined;

    const accessExpiresAt = toNumber(localStorage.getItem(KEYS.accessExpiresAt));
    const refreshExpiresAt = toNumber(localStorage.getItem(KEYS.refreshExpiresAt));

    if (!accessToken || !refreshToken || !accessExpiresAt || !refreshExpiresAt) return undefined;
    return { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt };
}

export function saveTokens(tokens: TokenPair): void {
    localStorage.setItem(KEYS.access, tokens.accessToken);
    localStorage.setItem(KEYS.refresh, tokens.refreshToken);
    localStorage.setItem(KEYS.accessExpiresAt, String(tokens.accessExpiresAt));
    localStorage.setItem(KEYS.refreshExpiresAt, String(tokens.refreshExpiresAt));
}

export function clearTokens(): void {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
    localStorage.removeItem(KEYS.accessExpiresAt);
    localStorage.removeItem(KEYS.refreshExpiresAt);
}