import type { TutorUpsertInput } from "../tutores.models";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";

import TutorForm from "../components/TutorForm";
import { createTutor, getTutorById, updateTutor } from "../tutores.service";

export default function TutorFormPage({ mode }: { mode: "create" | "edit" }) {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState<TutorUpsertInput | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mode !== "edit" || !id) return;

        void (async () => {
            setError(null);
            setLoading(true);
            try {
                const tutor = await getTutorById(id);
                setInitial({
                    nome: tutor.nome,
                    telefone: tutor.telefone,
                    email: tutor.email,
                    endereco: tutor.endereco,
                    cpf: tutor.cpf,
                });
            } catch (err: unknown) {
                setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao carregar tutor.")
            } finally {
                setLoading(false);
            }
        })();
    }, [mode, id]);

    if (mode === "edit") {
        if (loading && !initial) return <div className="text-zinc-300">Caregando...</div>
        if (!loading && !initial) return (
            <div className="space-y-4">
                <div className="rounded-md border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                    Não foi possível carregar os dados do tutor.
                </div>
                <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                    Voltar
                </button>
            </div>
        );
    }

    async function handleSubmit(data: TutorUpsertInput): Promise<void> {
        setError(null);
        setLoading(true);

        try {
            if (mode === "create") {
                const created = await createTutor(data);
                void nav(`/tutores/${created.id}`, { replace: true });
            } else {
                if (!id) throw new Error("ID inválido.");
                await updateTutor(id, data);
                void nav(`/tutores/${id}`, { replace: true });
            }
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao salvar.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{mode === "create" ? "Novo Tutor" : "Editar Tutor"}</h1>
                <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                    Voltar
                </button>
            </div>

            {error && (
                <div className="rounded-md border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</div>
            )}

            <TutorForm initial={initial} loading={loading} onSubmit={(d) => void handleSubmit(d)} />
        </div>
    )
}