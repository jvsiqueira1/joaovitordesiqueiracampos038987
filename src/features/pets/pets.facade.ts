import type { Pet } from "./pets.models";

import { BehaviorSubject } from "rxjs";

import { ApiError } from "@/core/api/apiError";
import type { PageRequest } from "@/core/api/pagination";

import { listPets } from "./pets.service";

type PetsState = {
    page: number;
    size: number;
    q: string;
    items: Pet[];
    total: number;
    loading: boolean;
    error?: string;
}

const initialState: PetsState = {
    page: 0,
    size: 10,
    q: "",
    items: [],
    total: 0,
    loading: false,
    error: undefined,
};

export class PetsFacade {
    private readonly subject = new BehaviorSubject<PetsState>(initialState);
    readonly state$ = this.subject.asObservable();

    private seq = 0;

    getSnapshot(): PetsState {
        return this.subject.getValue();
    }

    async load(pageOverride?: number): Promise<void> {
        const curr = this.subject.getValue();
        const page = pageOverride ?? curr.page;
        const req: PageRequest = { page, size: curr.size, q: curr.q || undefined };

        const requestId = ++this.seq;
        this.subject.next({ ...curr, page, loading: true, error: undefined });

        try {
            const result = await listPets(req);

            if (requestId !== this.seq) return;

            this.subject.next({
                ...this.subject.getValue(),
                items: result.items,
                total: result.total,
                page: result.page ?? page,
                size: result.size ?? curr.size,
                loading: false,
                error: undefined,
            });
        } catch (err: unknown) {
            if (requestId !== this.seq) return;

            const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Falha ao carregar pets.";

            this.subject.next({
                ...this.subject.getValue(),
                loading: false,
                error: message,
            });
        }
    }

    async setQuery(q: string): Promise<void> {
        const curr = this.subject.getValue();
        const nextQ = q.trim();

        this.subject.next({ ...curr, q: nextQ, page: 0 });
        await this.load(0);
    }

    async nextPage(): Promise<void> {
        const s = this.subject.getValue();
        const totalPages = Math.max(1, Math.ceil(s.total / s.size));
        const next = Math.min(s.page + 1, totalPages - 1);
        await this.load(next);
    }

    async prevPage(): Promise<void> {
        const s = this.subject.getValue();
        const prev = Math.max(0, s.page - 1);
        await this.load(prev);
    }
}