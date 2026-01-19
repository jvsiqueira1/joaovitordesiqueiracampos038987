import { Route, Routes } from "react-router-dom";

import TutoresListPage from "./pages/TutoresListPage";

export default function TutoresModule() {
    return (
        <Routes>
            <Route index element={<TutoresListPage />}/>
        </Routes>
    )
}