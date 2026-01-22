import type { Pet } from "../pets.models";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";
import ConfirmDialog from "@/shared/ui/confirm/ConfirmDialog";
import { InlineError, LoadingText } from "@/shared/ui/feedback/Feedback";
import PhotoSection from "@/shared/ui/photo-section/PhotoSection";

import { deletePet, getPetById, removePetPhoto, uploadPetPhoto } from "../pets.service";


type confirmAction = "delete" | "removePhoto" | null;

export default function PetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();

    const [pet, setPet] = useState<Pet | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<confirmAction>(null);

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

    function openDeleteConfirm() {
        setConfirmAction("delete");
        setConfirmOpen(true);
    }

    function openRemovePhotoConfirm() {
        setConfirmAction("removePhoto");
        setConfirmOpen(true);
    }

    async function onConfirm(): Promise<void> {
        if (!id) return;

        setConfirmOpen(false);

        setActionLoading(true);
        setError(null);

        try {
            if (confirmAction === "delete") {
                await deletePet(id);
                void nav("/pets", { replace: true });
                return;
            }

            if (confirmAction === "removePhoto") {
                if (!pet?.foto?.id) return;
                await removePetPhoto(id, pet.foto.id);
                await load();
                return;
            }
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erro ao executar ação.")
        } finally {
            setActionLoading(false);
            setConfirmAction(null);
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

    if (loading) return <LoadingText />;

    if (error) {
        return (
            <div className="space-y-3">
                <InlineError message={error} />
                <button className="text-sm text-zinc-300 hover:text-white" onClick={() => void nav(-1)}>
                    Voltar
                </button>
            </div>
        );
    }

    if (!pet) return <div className="text-zinc-300">Pet não encontrado.</div>;

    const confirmTitle = confirmAction === "delete" ? "Excluir pet" : "Remover foto";
    const confirmDescription = confirmAction === "delete" ? "Tem certeza que deseja excluir este pet? Essa ação não pode ser desfeita." : "Tem certeza que deseja remover a foto atual?";

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
                        onClick={openDeleteConfirm}
                    >
                        Excluir
                    </button>
                </div>
            </div>

            <PhotoSection
                title="Foto"
                imageAlt={pet.nome}
                imageUrl={pet.foto?.url}
                disabled={actionLoading}
                onUpload={(file) => void onUpload(file)}
                onRemove={openRemovePhotoConfirm}
                showRemove={!!pet.foto?.id}
            />

            <ConfirmDialog
                open={confirmOpen}
                title={confirmTitle}
                description={confirmDescription}
                danger
                loading={actionLoading}
                onCancel={() => {
                    setConfirmOpen(false);
                    setConfirmAction(null);
                }}
                onConfirm={() => void onConfirm()}
            />
        </div>
    );
}