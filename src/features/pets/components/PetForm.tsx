import type { PetUpsertInput } from "../pets.models";

import { useState } from "react";

export default function PetForm({
    initial,
    loading,
    onSubmit,
}: {
    initial?: PetUpsertInput;
    loading: boolean;
    onSubmit: (data: PetUpsertInput) => void;
}) {
    const [nome, setNome] = useState(initial?.nome ?? "");
    const [raca, setRaca] = useState(initial?.raca ?? "");
    const [idade, setIdade] = useState<number>(initial?.idade ?? 0);

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit({ nome: nome.trim(), raca: raca.trim() || undefined, idade });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <label className="block">
                <span className="text-sm text-zinc-200">Nome</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </label>

            <label className="block">
                <span className="text-sm text-zinc-200">Raça</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={raca}
                    onChange={(e) => setRaca(e.target.value)}
                />
            </label>

            <label className="block">
                <span className="text-sm text-zinc-200">Idade</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    type="number"
                    min={0}
                    value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    required
                />
            </label>

            <button
                disabled={loading}
                className="rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 font-medium disabled:opacity-60"
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>
        </form>
    );
}