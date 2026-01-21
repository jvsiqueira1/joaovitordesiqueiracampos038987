import type { Tutor } from "../tutores.models";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";

import { deleteTutor, getTutorById, removeTutorPhoto, uploadTutorPhoto } from "../tutores.service";

export default function TutorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function load(): Promise<void> {
        if (!id) return;

        setError(null);
        setLoading(true);

        try {
            const data = await getTutorById(id);
            setTutor(data);
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao carregar tutor.")
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

        const ok = window.confirm("Tem certeza que deseja excluir este tutor?");
        if (!ok) return;

        setActionLoading(true);
        setError(null);

        try {
            await deleteTutor(id);
            void nav("tutores", { replace: true });
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao excluir tutor.")
        } finally {
            setActionLoading(false);
        }
    }

    async function onUpload(file: File): Promise<void> {
        if (!id) return;

        setActionLoading(true);
        setError(null);

        try {
            await uploadTutorPhoto(id, file);
            await load();
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao enviar foto.");
        } finally {
            setActionLoading(false);
        }
    }

    async function onRemovePhoto(): Promise<void> {
        if (!id || !tutor?.foto?.id) return;

        const ok = window.confirm("Remover a foto atual?")
        if (!ok) return;

        setActionLoading(true);
        setError(null);

        try {
            await removeTutorPhoto(id, tutor.foto.id);
            await load();
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao remover foto.");
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) return <div className="text-zinc-300">Carregando...</div>

    if (error) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</div>
                <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                    Voltar
                </button>
            </div>
        );
    }

    if (!tutor) return <div className="text-zinc-300">Tutor não encontrado.</div>

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">{tutor.nome}</h1>
                    <p className="text-sm text-zinc-300">{tutor.telefone}</p>
                    {tutor.email ? <p className="text-sm text-zinc-400">Email: {tutor.email}</p> : null}
                    {tutor.endereco ? <p className="text-xs text-zinc-400">Endereço: {tutor.endereco}</p> : null}
                    {tutor.cpf ? <p className="text-xs text-zinc-400">CPF: {tutor.cpf}</p> : null}
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/tutores/${id}/edit`}
                        className="rounded-md border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-700"
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

                <div className="flex items-start gap-4">
                    <div className="h-28 w-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                        {tutor.foto?.url ? (
                            <img
                                src={tutor.foto.url}
                                alt={tutor.nome}
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="block">
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

                        {tutor.foto?.id ? (
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