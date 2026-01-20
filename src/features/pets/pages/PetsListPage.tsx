import { useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { useObservable } from "@/shared/hooks/useObservable";

import { pets } from "../pets.instance";

export default function PetsListPage() {
    const snapshot = useMemo(() => pets.getSnapshot(), []);
    const state = useObservable(pets.state$, snapshot);

    const [query, setQuery] = useState(state.q);
    const debounced = useDebounce(query, 300);

    useEffect(() => {
        if (state.items.length === 0 && !state.loading && !state.error) {
            void pets.load(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        void pets.setQuery(debounced);
    }, [debounced]);

    const totalPages = Math.max(1, Math.ceil(state.total / state.size));

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Pets</h1>
                    <p className="text-sm text-zinc-300">
                        Total: {state.total} - Página: {state.page + 1} de {totalPages}
                    </p>
                </div>

                <div className="w-full sm:w-80">
                    <label className="block text-sm text-zinc-200">Buscar por nome</label>
                    <input className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ex: Bob" />
                </div>
            </div>

            {state.error && (
                <div className="rounded-md border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
                    {state.error}
                </div>
            )}

            {state.loading ? (
                <div className="text-zinc-300">Carregando...</div>
            ) : state.items.length === 0 ? (
                <div className="text-zinc-300">Nenhum pet encontrado.</div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {state.items.map((p) => (
                        <div key={p.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                            <div className="flex items-start gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
                                    {p.fotoUrl ? (
                                        <img src={p.fotoUrl} alt={p.nome} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>

                                <div className="min-w-0">
                                    <div className="truncate text-base font-semibold">{p.nome}</div>
                                    <div className="text=sm text-zinc-300">
                                        {p.especie} - {p.idade} anos
                                    </div>
                                    {p.tutorId ? <div className="text-xs text-zinc-400">Tutor: {p.tutorId}</div> : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-2">
                <button
                    className="rounded-md border border-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
                    disabled={state.loading || state.page === 0}
                    onClick={() => void pets.prevPage()}
                >
                    Anterior
                </button>
                <button
                    className="rounded-md border border-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
                    disabled={state.loading || state.page >= totalPages - 1}
                    onClick={() => void pets.nextPage()}
                >
                    Próxima
                </button>
            </div>
        </div>
    )
}