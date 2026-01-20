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

type SearchCache = {
    q: string;
    all: Pet[];
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
    private searchCache: SearchCache | null = null;

    getSnapshot(): PetsState {
        return this.subject.getValue();
    }

    async load(pageOverride?: number): Promise<void> {
        const curr = this.subject.getValue();
        const page = pageOverride ?? curr.page;
        const q = curr.q.trim().toLowerCase();

        if (q.length >= 2 && this.searchCache?.q === q) {
            this.applySearchCache(page);
            return;
        }

        const requestId = ++this.seq;
        this.subject.next({ ...curr, page, loading: true, error: undefined });

        try {
            const req: PageRequest = { page, size: curr.size };
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

            const message = 
                err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Falha ao carregar pets.";

            this.subject.next({ ...this.subject.getValue(), loading: false, error: message });
        }
    }

    async setQuery(q: string): Promise<void> {
        const curr = this.subject.getValue();
        const nextQ = q.trim();

        this.subject.next({ ...curr, q: nextQ, page: 0 });
        
        if (nextQ.length < 2) {
            this.searchCache = null;
            await this.load(0);
            return;
        }

        const qLower = nextQ.toLowerCase();

        if (!this.searchCache || this.searchCache.q !== qLower) {
            await this.buildSearchCache(qLower);
        }

        this.applySearchCache(0);
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

    private applySearchCache(page: number): void {
        const curr = this.subject.getValue();
        const cache = this.searchCache;
        if (!cache) return;

        const start = page * curr.size;
        const end = start + curr.size;

        this.subject.next({
            ...curr,
            page,
            items: cache.all.slice(start, end),
            total: cache.all.length,
            loading: false,
            error: undefined,
        });
    }

    private async buildSearchCache(qLower: string): Promise<void> {
        const curr = this.subject.getValue();
        const requestId = ++this.seq;

        this.subject.next({ ...curr, loading: true, error: undefined });

        try {
            const fetchSize = 100;

            const first = await listPets({ page: 0, size: fetchSize });
            if (requestId !== this.seq) return;

            const totalPages = Math.max(1, Math.ceil(first.total / fetchSize));

            const restPromises: Array<Promise<{ items: Pet[]; total: number; page?: number; size?: number }>> = [];
            for (let p = 1; p < totalPages; p++) {
                restPromises.push(listPets({ page: p, size: fetchSize }));
            }

            const rest = await Promise.all(restPromises);
            if (requestId !== this.seq) return;

            const all = first.items.concat(...rest.flatMap((r) => r.items));
            const filtered = all.filter((pet) => pet.nome.toLowerCase().includes(qLower));

            this.searchCache = { q: qLower, all: filtered };

            this.subject.next({ ...this.subject.getValue(), loading: false, error: undefined });
        } catch (err: unknown) {
            if (requestId !== this.seq) return;

            this.searchCache = null;

            const message = 
                err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Falha ao buscar pets."

            this.subject.next({ ...this.subject.getValue(), loading: false, error: message });
        }
    }
}