import type { Tutor } from "../tutores.models";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";

import {
    deleteTutor,
    getTutorById,
    linkPetToTutor,
    removeTutorPhoto,
    unlinkPetFromTutor,
    uploadTutorPhoto,
} from "../tutores.service";

export default function TutorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [petIdInput, setPetIdInput] = useState("");
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
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao carregar tutor.");
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
            void nav("/tutores", { replace: true });
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao excluir tutor.");
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

        const ok = window.confirm("Remover a foto atual?");
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

    async function onLinkPet(): Promise<void> {
        if (!id) return;

        const petId = petIdInput.trim();
        if (!petId) return;

        setActionLoading(true);
        setError(null);

        try {
            await linkPetToTutor(id, petId);
            setPetIdInput("");
            await load();
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao vincular pet.");
        } finally {
            setActionLoading(false);
        }
    }

    async function onUnlinkPet(petId: string): Promise<void> {
        if (!id) return;

        const ok = window.confirm("Remover o vínculo deste pet com o tutor?");
        if (!ok) return;

        setActionLoading(true);
        setError(null);

        try {
            await unlinkPetFromTutor(id, petId);
            await load();
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao remover vínculo.");
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

    if (!tutor) return <div className="text-zinc-300">Tutor não encontrado.</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{tutor.nome}</h1>
                    <p className="text-sm text-zinc-300">{tutor.telefone}</p>
                    {tutor.email ? <p className="text-xs text-zinc-400">Email: {tutor.email}</p> : null}
                    {tutor.endereco ? <p className="text-xs text-zinc-400">Endereço: {tutor.endereco}</p> : null}
                    {tutor.cpf ? <p className="text-xs text-zinc-400">CPF: {tutor.cpf}</p> : null}
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                    <Link
                        to={`/tutores/${id}/edit`}
                        className="flex-1 text-center rounded-md border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-700 sm:flex-none"
                    >
                        Editar
                    </Link>

                    <button
                        disabled={actionLoading}
                        className="flex-1 rounded-md border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200 disabled:opacity-60 sm:flex-none"
                        onClick={() => void onDelete()}
                    >
                        Excluir
                    </button>
                </div>
            </div>

            {/* Foto igual ao PetDetail */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
                <div className="text-sm font-medium">Foto</div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
                    <div className="h-28 w-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                        {tutor.foto?.url ? (
                            <img
                                src={tutor.foto.url}
                                alt={tutor.nome}
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>

                    <div className="space-y-2 sm:w-auto">
                        <label className="block">
                            <span className="text-sm text-zinc-200">Enviar nova foto</span>
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

            {/* Pets vinculados no mesmo estilo */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-sm font-medium">Pets vinculados</div>
                        <div className="text-xs text-zinc-400">Vincule/desvincule pets usando o ID do pet.</div>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <input
                            className="w-full rounded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 text-sm outline-none sm:w-56"
                            value={petIdInput}
                            onChange={(e) => setPetIdInput(e.target.value)}
                            placeholder="ID do pet (ex: 103)"
                            inputMode="numeric"
                            disabled={actionLoading}
                        />
                        <button
                            disabled={actionLoading || petIdInput.trim().length === 0}
                            className="w-full rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60 sm:w-auto"
                            onClick={() => void onLinkPet()}
                        >
                            Vincular
                        </button>
                    </div>
                </div>

                {tutor.pets && tutor.pets.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {tutor.pets.map((p) => (
                            <div key={p.id} className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
                                        {p.foto?.url ? (
                                            <img
                                                src={p.foto.url}
                                                alt={p.nome}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">
                                                Sem foto
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-semibold">{p.nome}</div>
                                        <div className="text-xs text-zinc-400">
                                            {p.idade} anos{p.raca ? ` - ${p.raca}` : ""}
                                        </div>
                                        <div className="text-[10px] text-zinc-500">ID: {p.id}</div>
                                    </div>

                                    <button
                                        disabled={actionLoading}
                                        className="rounded-md border border-zinc-800 px-2 py-1 text-xs disabled:opacity-60"
                                        onClick={() => void onUnlinkPet(p.id)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-zinc-300">Nenhum pet vinculado.</div>
                )}
            </div>
        </div>
    );
}
