import { Navigate, Route, Routes } from "react-router-dom";

import PetDetailPage from "./pages/PetDetailPage";
import PetFormPage from "./pages/PetFormPage";
import PetsListPage from "./pages/PetsListPage";

export default function PetsModule() {
    return (
        <Routes>
            <Route index element={<PetsListPage />} />
            <Route path="new" element={<PetFormPage mode="create" />} />
            <Route path=":id" element={<PetDetailPage />} />
            <Route path=":id/edit" element={<PetFormPage mode="edit" />} />
            <Route path="*" element={<Navigate to="/pets" replace />} />
        </Routes>
    )
}