import type { Pet } from "../pets.models";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";

import { deletePet, getPetById, removePetPhoto, uploadPetPhoto } from "../pets.service";

export default function PetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();

    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function load(): Promise<void> {
        if (!id) return;
        setError(null);
        setLoading(true);
        try {
            const data = await getPetById(id);
            setPet(data);
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao carregar pet.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function onDelete(): Promise<void> {
        if (!id) return;
        const ok = window.confirm("Tem certeza que deseja deletar este pet?");
        if (!ok) return;

        setActionLoading(true);
        setError(null);

        try {
            await deletePet(id);
            void nav("/pets", { replace: true });
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao deletar.")
        } finally {
            setActionLoading(false);
        }
    }

    async function onUpload(file: File): Promise<void> {
        if (!id) return;
        setActionLoading(true);
        setError(null);

        try {
            await uploadPetPhoto(id, file);
            await load();
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao enviar foto.");
        } finally {
            setActionLoading(false);
        }
    }

    async function onRemovePhoto(): Promise<void> {
        if (!id || !pet?.foto?.id) return;
        const ok = window.confirm("Tem certeza que deseja remover esta foto?");
        if (!ok) return;

        setActionLoading(true);
        setError(null);

        try {
            await removePetPhoto(id, pet.foto.id);
            await load();
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao remover foto.")
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) return <div className="text-zinc-300">Carregando...</div>;

    if (error) {
        return (
            <div className="space-y-3">
                <div className="rounded-md border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">{error}</div>
                <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                    Voltar
                </button>
            </div>
        );
    }

    if (!pet) return <div className="text-zinc-300">Pet não encontrado.</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">{pet.nome}</h1>
                    <p className="text-sm text-zinc-300">
                        Idade: {pet.idade} anos {pet.raca ? `- Raça: ${pet.raca}` : ""}
                    </p>
                    {pet.tutorId ? <p className="text-xs text-zinc-400">TutorId: {pet.tutorId}</p> : null}
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/pets/${pet.id}/edit`}
                        className="rounded-md border border-zinc-800 px-3 py-2 text-sm hover:botder-zinc-700"
                    >
                        Editar
                    </Link>
                    <button
                        disabled={actionLoading}
                        className="rounded-md border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200 disabled:opacity-60"
                        onClick={() => void onDelete()}
                    >
                        Excluir
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
                <div className="text-sm font-medium">Foto</div>

                <div className="flex items-center gap-4">
                    <div className="h-28 w-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                        {pet.foto?.url ? <img src={pet.foto.url} alt={pet.nome} className="h-full w-full object-cover" /> : null}
                    </div>

                    <div className="space-y-2">
                        <label className="block">
                            <span className="text-sm text-zinc-200">Enviar uma foto</span>
                            <input
                                className="mt-1 block w-full text-sm text-zinc-300"
                                type="file"
                                accept="image/*"
                                disabled={actionLoading}
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) void onUpload(f);
                                    e.currentTarget.value = "";
                                }}
                            />
                        </label>

                        {pet.foto?.id ? (
                            <button
                                disabled={actionLoading}
                                className="rounded-md border border-zinc-800 px-3 py-2 text-sm disabled:opacity-60"
                                onClick={() => void onRemovePhoto()}
                            >
                                Remover foto
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}