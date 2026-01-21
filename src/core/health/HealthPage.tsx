import { useEffect, useState } from "react";

import { http } from "../api/http";

type Status = "checking" | "ok" | "fail";

export default function HealthPage() {
    const [liveness] = useState<Status>("ok");
    const [readiness, setReadiness] = useState<Status>("checking");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        void (async () => {
            try {
                await http.get("/v1/pets", { params: { page: 0, size: 1 } });
                setReadiness("ok");
                setMessage("API acessível.");
            } catch (err: unknown) {
                setReadiness("fail");
                setMessage(err instanceof Error ? err.message : "Falha ao acessar API.");
            }
        })();
    }, []);

    function badge(s: Status) {
        if (s === "ok") return "bg-emerald-500/20 text-emerald-200 border-emerald-900/60";
        if (s === "fail") return "bg-red-500/20 text-red-200 border-red-900/60";
        return "bg-zinc-500/20 text-zinc-200 border-zinc-800";
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Health</h1>
                <p className="text-sm text-zinc-300">Liveness &amp; Readiness</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Liveness</div>
                        <span className={`rounded-md border px-2 py-1 text-xs ${badge(liveness)}`}>OK</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">Aplicação carregada e renderizando.</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Readiness</div>
                        <span className={`rounded-md border px-2 py-1 text-xs ${badge(readiness)}`}>
                            {readiness === "checking" ? "CHECKING" : readiness.toUpperCase()}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">{message || "Verificando acesso à API..."}</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-4 text-xs text-zinc-400">
                Dica: se der FAIL por 401, faça login primeiro (admin/admin) e recarregue.
            </div>
        </div>
    )
}