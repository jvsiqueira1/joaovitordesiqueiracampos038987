import { Navigate, Route, Routes } from "react-router-dom";

import TutorDetailPage from "./pages/TutorDetailPage";
import TutoresListPage from "./pages/TutoresListPage";
import TutorFormPage from "./pages/TutorFormPage";

export default function TutoresModule() {
    return (
        <Routes>
            <Route index element={<TutoresListPage />} />
            <Route path="new" element={<TutorFormPage mode="create" />} />
            <Route path=":id" element={<TutorDetailPage />} />
            <Route path=":id/edit" element={<TutorFormPage mode="edit" />} />
            <Route path="*" element={<Navigate to="/tutores" replace />} />
        </Routes>
    )
}