import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "@/core/api/apiError";
import { auth } from "@/core/auth/auth.instance";

export default function LoginPage() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        void handleSubmit();

    }

    async function handleSubmit() {
        setError(null);
        setLoading(true);

        try {
            await auth.login({ username, password });
            void nav("/pets", { replace: true });
        } catch (err: unknown) {
            if (err instanceof ApiError) setError(err.message);
            else if (err instanceof Error) setError(err.message);
            else setError("Falha ao autenticar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm rouded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                <h1 className="text-xl font-semibold">Login</h1>
                <p className="text-sm text-zinc-300 mt-1">Use admin/admin (Swagger)</p>

                <div className="mt-5 space-y-3">
                    <label className="block">
                        <span className="text-sm text-zinc-200">Usuário</span>
                        <input className="mt-1 w-full rouded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username"/>
                    </label>
                    <label className="block">
                        <span className="text-sm text-zinc-200">Senha</span>
                        <input className="mt-1 w-full rouded-md bg-zinc-950/60 border border-zinc-800 px-3 py-2 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="username"/>
                    </label>

                    {error && <div className="text-sm text-red-300">{error}</div>}

                    <button disabled={loading} className="w-full rouded-md bg-zinc-100 text-zinc-900 py-2 font-medium disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button>
                </div>
            </form>
        </div>
    )
}