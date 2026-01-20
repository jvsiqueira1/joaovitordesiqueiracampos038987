import type { Page } from "./pagination";

type HeadersLike = Record<string, string | string[] | undefined>;
type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const n = Number(value);
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}

export function parsePage<T>(
    data: unknown,
    headers: HeadersLike,
    req: { page: number; size: number },
): Page<T> {
    if (Array.isArray(data)) {
        const totalHeader = headers["x-total-count"];
        const total = asNumber(Array.isArray(totalHeader) ? totalHeader[0] : totalHeader) ?? data.length;

        return { items: data as unknown as T[], total, page: req.page, size: req.size };
    }

    if (isRecord(data) && Array.isArray(data["items"])) {
        const total = asNumber(data["total"]) ?? (data["items"] as unknown[]).length;
        const page = asNumber(data["page"]) ?? req.page;
        const size = asNumber(data["size"]) ?? req.size;

        return {
            items: data["items"] as unknown as T[],
            total,
            page,
            size,
        };
    }

    if (isRecord(data) && Array.isArray(data["content"])) {
        const total = asNumber(data["total"]) ?? (data["content"] as unknown[]).length;
        const page = asNumber(data["page"]) ?? req.page;
        const size = asNumber(data["size"]) ?? req.size;

        return {
            items: data["content"] as unknown as T[],
            total,
            page,
            size,
        };
    }

    if (isRecord(data) && Array.isArray(data["data"])) {
        const total = 
            asNumber(data["total"]) ??
            (isRecord(data["meta"]) ? asNumber(data["meta"]["total"]) : undefined) ??
            (data["data"] as unknown[]).length;

        return {
            items: data["data"] as unknown as T[],
            total,
            page: req.page,
            size: req.size,
        };
    }

    return { items: [], total: 0, page: req.page, size: req.size };
}