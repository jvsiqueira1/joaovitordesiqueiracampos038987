import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { useObservable } from "@/shared/hooks/useObservable";

import { pets } from "../pets.instance";

export default function PetsListPage() {
    const snapshot = useMemo(() => pets.getSnapshot(), []);
    const state = useObservable(pets.state$, snapshot);

    const [query, setQuery] = useState(state.q);
    const debounced = useDebounce(query, 300);

    useEffect(() => {
        void pets.load(0);
    }, [])

    useEffect(() => {
        const q = debounced.trim();

        if (q.length === 0 || q.length >= 2) {
            void pets.setQuery(q);
        }

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

                <div className="flex w-full gap-3 sm:w-auto sm:items-end">
                    <div className="w-full sm:w-80">
                        <label className="block text-sm text-zinc-200">Buscar por nome</label>
                        <input
                            className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                            value={query} onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ex: Bob"
                        />
                    </div>
                </div>

                <Link
                    to="/pets/new"
                    className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 flex items-center justify-center"
                >
                    Novo pet
                </Link>
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
                        <Link
                            key={p.id}
                            to={`/pets/${p.id}`}
                            className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 hover:border-zinc-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                                    {p.foto?.url ? (
                                        <img src={p.foto.url} alt={p.nome} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                                            Sem foto
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-base font-semibold text-zinc-50 group-hover:text-white">
                                        {p.nome}
                                    </div>

                                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-300">
                                        <span>{p.idade} anos</span>
                                        {p.raca ? <span className="text-zinc-400">- {p.raca}</span> : null}
                                    </div>
                                </div>
                            </div>
                        </Link>
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