import type { PetUpsertInput } from "../pets.models";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";
import { InlineError, LoadingText } from "@/shared/ui/feedback/Feedback";

import PetForm from "../components/PetForm";
import { createPet, getPetById, updatePet } from "../pets.service";

export default function PetFormPage({ mode }: { mode: "create" | "edit" }) {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState<PetUpsertInput | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mode !== "edit" || !id) return;

        void (async () => {
            setError(null);
            setLoading(true);
            try {
                const pet = await getPetById(id);
                setInitial({ nome: pet.nome, idade: pet.idade, raca: pet.raca });
            } catch (err: unknown) {
                setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao carregar pet.");
            } finally {
                setLoading(false);
            }
        })();
    }, [mode, id]);

    async function handleSubmit(data: PetUpsertInput): Promise<void> {
        setError(null);
        setLoading(true);
        try {
            if (mode === "create") {
                const created = await createPet(data);
                void nav(`/pets/${created.id}`, { replace: true });
            } else {
                if (!id) throw new Error("ID inválido.");
                await updatePet(id, data);
                void nav(`/pets/${id}`, { replace: true });
            }
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao salvar.")
        } finally {
            setLoading(false);
        }
    }

    if (mode === "edit") {
        if (loading && !initial) {
            return <LoadingText />
        }

        if (!loading && !initial) {
            return (
                <div className="space-y-3">
                    <InlineError message="Não foi possível carregar os dados do pet." />

                    <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                        Voltar
                    </button>
                </div>
            )
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{mode === "create" ? "Novo Pet" : "Editar Pet"}</h1>
                <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                    Voltar
                </button>
            </div>

            {error && (
                <InlineError message={error} />
            )}

            <PetForm initial={initial} loading={loading} onSubmit={(d) => void handleSubmit(d)} />
        </div>
    )
}