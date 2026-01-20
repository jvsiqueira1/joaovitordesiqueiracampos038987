import type { Tutor, TutorId, TutorPhoto, TutorUpsertInput } from "./tutores.models";
import type { AxiosResponse } from "axios";

import { ApiError } from "@/core/api/apiError";
import { http } from "@/core/api/http";
import type { Page, PageRequest } from "@/core/api/pagination";
import { parsePage } from "@/core/api/parsePage";


const TUTORES_QUERY = {
    page: "page",
    size: "size",
    searchByName: "nome",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
}

function asId(value: unknown): TutorId | undefined {
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return undefined;
}

function toCpfNumber(cpf?: string): number | undefined {
    if (!cpf) return undefined;
    const digits = cpf.replace(/\D/g, "");
    if (digits.length === 0) return undefined;
    const n = Number(digits);
    return Number.isFinite(n) ? n : undefined;
}

function toPhoto(value: unknown): TutorPhoto | undefined {
    if (!isRecord(value)) return undefined;

    const id = asId(value["id"]);
    const nome = asString(value["nome"]);
    const contentType = asString(value["contentType"]);
    const url = asString(value["url"]);

    if (!id || !nome || !contentType || !url) return undefined;
    return { id, nome, contentType, url };
}

function toTutor(dto: unknown): Tutor {
    if (!isRecord(dto)) throw new ApiError("Resposta inválida ao converter Tutor.");

    const id = asId(dto["id"]);
    const nome = asString(dto["nome"]);
    const telefone = asString(dto["telefone"]);

    if (!id || !nome || !telefone) {
        throw new ApiError("Resposta inválida: Tutor sem campos obrigatórios (id/nome/telefone).", { details: dto});
    }

    const cpf = 
        asString(dto["cpf"]) ??
        (typeof dto["cpf"] === "number" && Number.isFinite(dto["cpf"]) ? String(dto["cpf"]) : undefined);
    
    return {
        id,
        nome,
        telefone,
        email: asString(dto["email"]),
        endereco: asString(dto["endereco"]),
        cpf,
        foto: toPhoto(dto["foto"]),
    };
}

type HeadersLike = Record<string, string | string[] | undefined>;

function toHeaderValue(value: unknown): string | string[] | undefined {
    if (typeof value === "string") return value;

    if (Array.isArray(value) && value.every((v): v is string => typeof v === "string")) {
        return value;
    }

    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
        return String(value);
    }

    if (value instanceof Date) return value.toISOString();

    if (value === null || value === undefined) return undefined;

    return undefined;
}

function headersToRecord(res: AxiosResponse<unknown>): HeadersLike {
    const out: HeadersLike = {};
    for (const [k, v] of Object.entries(res.headers ?? {})) {
        out[k.toLowerCase()] = toHeaderValue(v);
    }
    return out;
}

export async function listTutores(req: PageRequest): Promise<Page<Tutor>> {
    const params: Record<string, unknown> = {
        [TUTORES_QUERY.page]: req.page,
        [TUTORES_QUERY.size]: req.size,
    };

    if (req.q && req.q.trim().length > 0) {
        params[TUTORES_QUERY.searchByName] = req.q.trim();
    }

    const res = await http.get<unknown>("/v1/tutores", { params });
    const pageUnknown = parsePage<unknown>(res.data, headersToRecord(res), { page: req.page, size: req.size });

    return { ...pageUnknown, items: pageUnknown.items.map(toTutor) };
}

export async function getTutorById(id: TutorId): Promise<Tutor> {
    const res = await http.get<unknown>(`/v1/tutores/${id}`);
    return toTutor(res.data);
}

export async function createTutor(input: TutorUpsertInput): Promise<Tutor> {
    const payload: Record<string, unknown> = {
        nome: input.nome,
        telefone: input.telefone,
        email: input.email,
        endereco: input.endereco,
        cpf: toCpfNumber(input.cpf),
    };

    const res = await http.post<unknown>("/v1/tutores", payload);
    return toTutor(res.data);
}

export async function updateTutor(id: TutorId, input: TutorUpsertInput): Promise<Tutor> {
    const payload: Record<string, unknown> = {
        nome: input.nome,
        telefone: input.telefone,
        email: input.email,
        endereco: input.endereco,
        cpf: toCpfNumber(input.cpf),
    };

    const res = await http.put<unknown>(`/v1/tutores/${id}`, payload);
    return toTutor(res.data);
}

export async function deleteTutor(id: TutorId): Promise<void> {
    await http.delete<unknown>(`/v1/tutores/${id}`);
}

export async function uploadTutorPhoto(id: TutorId, file: File, fieldName: string = "foto"): Promise<void> {
    const form = new FormData();
    form.append(fieldName, file);
    await http.post(`/v1/tutores/${id}/fotos`, form);
}

export async function removeTutorPhoto(id: TutorId, fotoId: string): Promise<void> {
    await http.delete(`/v1/tutores/${id}/fotos/${fotoId}`);
}

export async function linkPetToTutor(tutorId: TutorId, petId: string): Promise<void> {
    await http.post(`/v1/tutores/${tutorId}/pets/${petId}`, null);
}

export async function unlinkPetFromTutor(tutorId: TutorId, petId: string): Promise<void> {
    await http.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
}