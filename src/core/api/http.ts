import axios from "axios";

import { toApiError } from "./apiError";

const API_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({
    baseURL: API_URL,
    timeout: 20_000,
})

http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(toApiError(err)),
)