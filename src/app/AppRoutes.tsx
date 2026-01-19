import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./AppShell";

const PetsModule = lazy(() => import("../features/pets/PetsModule"));
const TutoresModule = lazy(() => import("../features/tutores/TutoresModule"));

function Loader() {
    return <div className="text-zinc-300">Carregando...</div>
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route element={<AppShell />}>
                    <Route index element={<Navigate to={"/pets"}/>} />
                    <Route path="/pets/*" element={<PetsModule />}/>
                    <Route path="/tutores/*" element={<TutoresModule />}/>
                </Route>

                <Route path="*" element={<div className="text-zinc-300 text-center py-10">404 - Página não encontrada</div>} />
            </Routes>
        </Suspense>
    )
}