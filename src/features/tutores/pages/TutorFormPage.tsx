export default function TutorFormPage({ mode }: { mode: "create" | "edit" }) {
    return <h1 className="text-2xl font-semibold">{mode === "create" ? "Novo Tutor" : "Editar Tutor"}</h1>
}