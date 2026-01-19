import { Route, Routes } from "react-router-dom";

import PetsListPage from "./pages/PetsListPage";

export default function PetsModule() {
    return (
        <Routes>
            <Route index element={<PetsListPage />} />
        </Routes>
    )
}