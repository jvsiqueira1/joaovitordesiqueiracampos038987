import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { auth } from "@/core/auth/auth.instance";
import { useObservable } from "@/shared/hooks/useObservable";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const state = useObservable(auth.state$, auth.getSnapshot());
    if (state.status !== "authenticated") return <Navigate to="/login"/>;
    return <>{children}</>;
}