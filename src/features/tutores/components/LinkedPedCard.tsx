import type { LinkedPet } from "../tutores.models";

export default function LinkedPetCard({
    pet,
    disabled,
    onRemove,
}: {
    pet: LinkedPet;
    disabled?: boolean;
    onRemove: () => void;
}) {
    const imgSrc = pet.foto?.url || "";

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-3">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
                    {imgSrc ? (
                        <img src={imgSrc} alt={pet.nome} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">Sem foto</div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{pet.nome}</div>
                    <div className="text-xs text-zinc-400">
                        {pet.idade} anos{pet.raca ? ` - ${pet.raca}` : ""}
                    </div>
                    <div className="text-[10px] text-zinc-500">ID: {pet.id}</div>
                </div>

                <button
                    disabled={disabled}
                    className="shrink-0 rounded-md border border-zinc-800 px-2 py-1 text-xs disabled:opacity-60"
                    onClick={onRemove}
                >
                    Remover
                </button>
            </div>
        </div>
    );
}