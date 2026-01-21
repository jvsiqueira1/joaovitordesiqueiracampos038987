import type { TutorUpsertInput } from "../tutores.models";

import { useState } from "react";


function onlyDigits(value: string): string {
    return value.replace(/\D/g, "");
}

function formatPhoneBR(value: string): string {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function TutorForm({
    initial,
    loading,
    onSubmit,
}: {
    initial?: TutorUpsertInput;
    loading: boolean;
    onSubmit: (data: TutorUpsertInput) => void;
}) {
    const [nome, setNome] = useState(initial?.nome ?? "");
    const [telefone, setTelefone] = useState(initial?.telefone ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [endereco, setEndereco] = useState(initial?.endereco ?? "");
    const [cpf, setCpf] = useState(initial?.cpf ?? "");

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        onSubmit({
            nome: nome.trim(),
            telefone: telefone.trim(),
            email: email.trim() || undefined,
            endereco: endereco.trim() || undefined,
            cpf: onlyDigits(cpf) || undefined,
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <label className="block">
                <span className="text-sm text-zinc-200">Nome *</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </label>

            <label className="block">
                <span className="text-sm text-zinc-200">Telefone *</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                    required
                    inputMode="tel"
                />
            </label>

            <label className="block">
                <span className="text-sm text-zinc-200">Email</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                />
            </label>

            <label className="block">
                <span className="text-sm text-zinc-200">Endereço</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                />
            </label>

            <label className="block">
                <span className="text-sm text-zinc-200">CPF</span>
                <input
                    className="mt-1 w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    inputMode="numeric"
                    placeholder="Somente números"
                />
            </label>

            <button
                disabled={loading}
                className="rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 font-medium disabled:opacity-60"
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>
        </form>
    )
}