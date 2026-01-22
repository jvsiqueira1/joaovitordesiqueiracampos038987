import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { useObservable } from "@/shared/hooks/useObservable";
import PageHeader from "@/shared/ui/page-header/PageHeader";

import TutorCard from "../components/TutorCard";
import { tutores } from "../tutores.instance";

export default function TutoresListPage() {
  const snapshot = useMemo(() => tutores.getSnapshot(), []);
  const state = useObservable(tutores.state$, snapshot);

  const [query, setQuery] = useState(state.q);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    void tutores.load(0);
  }, []);

  useEffect(() => {
    const q = debounced.trim();
    if (q.length === 0 || q.length >= 2) void tutores.setQuery(q);
  }, [debounced]);

  const totalPages = Math.max(1, Math.ceil(state.total / state.size));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tutores"
        subTitle={`Total: ${state.total} - Página: ${state.page + 1} de ${totalPages}`}
        right={
          <input
            className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome"
          />
        }
        actions={
          <Link
            to="/tutores/new"
            className="w-full rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 flex items-center justify-center sm:w-auto"
          >
            Novo tutor
          </Link>
        }
      />

      {state.error && (
        <div className="rounded-md border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
          {state.error}
        </div>
      )}

      {state.loading ? (
        <div className="text-zinc-300">Carregando...</div>
      ) : state.items.length === 0 ? (
        <div className="text-zinc-300">Nenhum tutor encontrado.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          className="rounded-md border border-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
          disabled={state.loading || state.page === 0}
          onClick={() => void tutores.prevPage()}
        >
          Anterior
        </button>
        <button
          className="rounded-md border border-zinc-800 px-3 py-2 text-sm disabled:opacity-50"
          disabled={state.loading || state.page >= totalPages - 1}
          onClick={() => void tutores.nextPage()}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
