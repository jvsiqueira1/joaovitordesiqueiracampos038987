import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) => 
[
    "rouded-md px-3 py-2 text-sm font-medium",
    isActive ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
].join(" ");

export default function AppShell() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div className="font-semibold">Pet Manager</div>

                    <nav className="flex gap-2">
                        <NavLink to="/pets" className={linkClass}>Pets</NavLink>
                        <NavLink to="/tutores" className={linkClass}>Tutores</NavLink>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    )
}