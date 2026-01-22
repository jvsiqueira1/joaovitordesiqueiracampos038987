import Button from "../button/Button";

type Props = {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    danger,
    loading,
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <button
                className="absolute inset-0 bg-black/60"
                onClick={onCancel}
                aria-label="Fechar"
                disabled={loading}
            />

            <div className="relative mx-auto mt-24 w-full max-w-md px-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-lg">
                    <div className="space-y-1">
                        <div className="text-base font-semibold text-zinc-50">{title}</div>
                        {description ? <div className="text-sm text-zinc-300">{description}</div> : null}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button variant="secondary" className="flex-1" disabled={loading} onClick={onCancel}>
                            {cancelText}
                        </Button>

                        <Button
                            variant={danger ? "danger" : "primary"}
                            className="flex-1"
                            disabled={loading}
                            onClick={onConfirm}
                        >
                            {loading ? "Aguarde..." : confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}