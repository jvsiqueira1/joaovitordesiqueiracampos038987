import axios, { type AxiosError } from "axios";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickMessage(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (isRecord(data)) {
    const m = data["message"];
    const e = data["error"];
    if (typeof m === "string") return m;
    if (typeof e === "string") return e;
  }

  return undefined;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly details?: unknown;
  readonly cause?: unknown;

  constructor(message: string, opts?: { status?: number; details?: unknown; cause?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.details = opts?.details;
    this.cause = opts?.cause;
  }
}

export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<unknown>;
    const status = ax.response?.status;
    const details = ax.response?.data;
    const message = pickMessage(details) ?? ax.message ?? "Erro inesperado";

    return new ApiError(message, { status, details, cause: err });
  }

  if (err instanceof Error) {
    return new ApiError(err.message, { cause: err });
  }

  return new ApiError("Erro inesperado", { cause: err });
}
