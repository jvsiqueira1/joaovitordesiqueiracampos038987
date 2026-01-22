import Button from "@/shared/ui/button/Button";

type Props = {
    title?: string;
    imageUrl?: string;
    imageAlt: string;
    disabled?: boolean;
    onUpload: (file: File) => void;
    onRemove?: () => void;
    showRemove?: boolean;
};

export default function PhotoSection({
    title = "Foto",
    imageUrl,
    imageAlt,
    disabled,
    onUpload,
    onRemove,
    showRemove,
}: Props) {
    const src = imageUrl ?? undefined;

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
            <div className="text-sm font-medium">{title}</div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="h-28 w-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
                    {src ? <img src={src} alt={imageAlt} className="h-full w-full object-cover" /> : null}
                </div>

                <div className="space-y-2 sm:min-w-64">
                    <label className="block">
                        <span className="text-sm text-zinc-200">Enviar nova foto</span>
                        <input
                            className="mt-1 block w-full text-sm text-zinc-300"
                            type="file"
                            accept="image/*"
                            disabled={disabled}
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) void onUpload(f);
                                e.currentTarget.value = "";
                            }}
                        />
                    </label>

                    {showRemove && onRemove ? (
                        <Button variant="secondary" disabled={disabled} onClick={onRemove}>
                            Remover foto
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    )
}