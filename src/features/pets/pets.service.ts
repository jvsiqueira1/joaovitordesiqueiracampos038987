import type { Pet, PetId, PetUpsertInput } from "./pets.models";
import type { AxiosResponse } from "axios";

import { ApiError } from "@/core/api/apiError";
import { http } from "@/core/api/http";
import type { Page, PageRequest } from "@/core/api/pagination";
import { parsePage } from "@/core/api/parsePage";


const PETS_QUERY = {
    page: "page",
    size: "size",
    seachByName: "nome",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asId(value: unknown): PetId | undefined {
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return undefined;
}

function toPet(dto: unknown): Pet {
    if (!isRecord(dto)) {
        throw new ApiError("Resposta inválida ao converter Pet.")
    }

    const id = asId(dto["id"]);
    const nome = asString(dto["nome"]);
    const especie = asString(dto["especie"]);
    const idade = asNumber(dto["idade"]);

    if (!id || !nome || !especie || idade === undefined) {
        throw new ApiError("Resposta inválida: Pet sem campos obrigatórios.", {
            details: dto,
        });
    }

    return {
        id,
        nome,
        especie,
        idade,
        raca: asString(dto["raca"]),
        tutorId: asId(dto["tutorId"]),
        fotoUrl: asString(dto['fotoUrl']) ?? asString(dto["foto"])
    }
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

export async function listPets(req: PageRequest): Promise<Page<Pet>> {
    const params: Record<string, unknown> = {
        [PETS_QUERY.page]: req.page,
        [PETS_QUERY.size]: req.size,
    };

    if (req.q && req.q.trim().length > 0) {
        params[PETS_QUERY.seachByName] = req.q.trim();
    }

    const res = await http.get<unknown>("/v1/pets", { params });
    const pageUnknown = parsePage<unknown>(res.data, headersToRecord(res), { page: req.page, size: req.size });

    return {
        ...pageUnknown,
        items: pageUnknown.items.map(toPet),
    };
}

export async function getPetById(id: PetId): Promise<Pet> {
    const res = await http.get<unknown>(`/v1/pets/${id}`);
    return toPet(res.data);
}

export async function createPet(input: PetUpsertInput): Promise<Pet> {
    const res = await http.post<unknown>("/v1/pets", input);
    return toPet(res.data);
}

export async function updatePet(id: PetId, input: PetUpsertInput): Promise<Pet> {
    const res = await http.put<unknown>(`/v1/pets/${id}`, input);
    return toPet(res.data);
}

export async function deletePet(id: PetId): Promise<void> {
    await http.delete<unknown>(`/v1/pets/${id}`);
}

export async function uploadPetPhoto(id: PetId, file: File, fieldName: string = "file"): Promise<void> {
    const form = new FormData();
    form.append(fieldName, file);

    await http.post(`/v1/pets/${id}/fotos`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}