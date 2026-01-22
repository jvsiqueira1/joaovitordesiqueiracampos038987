import type { Pet } from "../pets.models";

import { Link } from "react-router-dom";

export default function PetCard({ pet }: { pet: Pet }) {
    const imgSrc = pet.foto?.url ?? undefined;

    const formattedIdade = pet.idade < 2 ? `${pet.idade} ano` : `${pet.idade} anos`;

    return (
        <Link
            to={`/pets/${pet.id}`}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 hover:border-zinc-700"
        >
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                    {imgSrc ? (
                        <img src={imgSrc} alt={pet.nome} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">Sem foto</div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold text-zinc-50 group-hover:text-white">{pet.nome}</div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-300">
                        <span>{formattedIdade}</span>
                        {pet.raca ? <span className="text-zinc-400">Raça: {pet.raca}</span> : null}
                    </div>
                </div>
            </div>
        </Link>
    )
}