import type { Tutor } from "../tutores.models";

import { Link } from "react-router-dom";

export default function TutorCard({ tutor }: { tutor: Tutor }) {
    const imgSrc = tutor.foto?.url ?? undefined;

    const maskedCpf = tutor.cpf ?
        tutor.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        : null;

    const masketPhone = tutor.telefone ?
        tutor.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
        : null;

    return (
        <Link
            to={`/tutores/${tutor.id}`}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 hover:border-zinc-700"
        >
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                    {imgSrc ? (
                        <img src={imgSrc} alt={tutor.nome} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">Sem foto</div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold text-zinc-50 group-hover:text-white">{tutor.nome}</div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-300">
                        <span className="truncate">{masketPhone}</span>
                        {maskedCpf ? <span className="text-zinc-400 truncate">CPF: {maskedCpf}</span> : null}
                    </div>
                </div>
            </div>
        </Link>
    )
}