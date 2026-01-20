import type { AuthFacade } from "./auth.facade";

import axios, { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { toApiError } from "../api/apiError";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export function installAuthInterceptor(http: AxiosInstance, auth: AuthFacade): void {
    http.interceptors.request.use(async (config) => {
        try {
            const token =await auth.ensureFreshAccessToken();
            const headers = AxiosHeaders.from(config.headers);
            headers.set("Authorization", `Bearer ${token}`);
            config.headers = headers;
        } catch {
            auth.logout();
            return Promise.reject(toApiError(new Error("Sessão expirada.")));
        }

        return config;
    });

    http.interceptors.response.use(
        (res) => res,
        async (err: unknown) => {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const original = err.config as RetriableConfig | undefined;

                if (status === 401 && original && !original._retry && auth.getRefreshToken()) {
                    original._retry = true;
                    try {
                        const fresh = await auth.ensureFreshAccessToken();
                        const headers = AxiosHeaders.from(original.headers);
                        headers.set("Authorization", `Bearer ${fresh}`);
                        original.headers = headers;
                        return http.request(original);
                    } catch {
                        auth.logout();
                    }
                }
            }

            return Promise.reject(toApiError(err));
        },
    );
}