function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function InlineError({ message, className }: { message: string; className?: string }) {
    return (
        <div className={cx("rounded-md border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200", className)}>
            {message}
        </div>
    );
}

export function EmptyState({ message, className }: { message: string, className?: string }) {
    return <div className={cx("text-zinc-300 text-sm", className)}>{message}</div>;
}

export function LoadingText({ message = "Carregando...", className }: { message?: string; className?: string }) {
    return <div className={cx("text-zinc-300 text-sm", className)}>{message}</div>;
}