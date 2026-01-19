import axios from "axios";

import { toApiError } from "./apiError";

const API_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({
    baseURL: API_URL,
    timeout: 20_000,
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(toApiError(err)),
)