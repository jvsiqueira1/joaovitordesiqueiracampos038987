import type { LoginRequest, TokenPair } from "./auth.models";

import axios, { type AxiosInstance } from "axios";

import { ApiError } from "@/core/api/apiError";

type TokenResponseDto = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
};

const API_URL = import.meta.env.VITE_API_URL;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTokenResponseDto(value: unknown): value is TokenResponseDto {
  return (
    isRecord(value) &&
    typeof value["access_token"] === "string" &&
    typeof value["refresh_token"] === "string" &&
    typeof value["expires_in"] === "number" &&
    typeof value["refresh_expires_in"] === "number"
  );
}

function toTokenPair(dto: TokenResponseDto): TokenPair {
  const now = Date.now();
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
    accessExpiresAt: now + dto.expires_in * 1000,
    refreshExpiresAt: now + dto.refresh_expires_in * 1000,
  };
}

const authHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
});

export async function login(req: LoginRequest): Promise<TokenPair> {
  const res = await authHttp.post<unknown>("/autenticacao/login", req);

  if (!isTokenResponseDto(res.data)) {
    throw new ApiError("Resposta inválida do login.", { details: res.data });
  }
  return toTokenPair(res.data);
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  const res = await authHttp.request<unknown>({
    method: "PUT",
    url: "/autenticacao/refresh",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": undefined,
    },
  });

  if (!isTokenResponseDto(res.data)) {
    throw new ApiError("Resposta inválida ao renovar token.", { details: res.data });
  }

  return toTokenPair(res.data);
}
