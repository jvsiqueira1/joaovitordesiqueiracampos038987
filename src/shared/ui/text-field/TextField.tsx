import { forwardRef, useId } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    helperText?: string;
    errorText?: string;
}

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
    { id, label, helperText, errorText, className, ...props },
    ref
) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
        <label className="block">
            {label ? <span className="text-sm text-zinc-200">{label}</span> : null}

            <input
                id={inputId}
                ref={ref}
                className={cx(
                    "mt-1 w-full rounded-md bg-zinc-950/60 border px-3 py-2 outline-none text-zinc-50",
                    errorText ? "border-red-900/60" : "border-zinc-800",
                    className,
                )}
                {...props}
            />

            {errorText ? (
                <div className="mt-1 text-xs text-red-200">{errorText}</div>
            ) : helperText ? (
                <div className="mt-1 text-xs text-zinc-400">{helperText}</div>
            ) : null}
        </label>
    );
});

export default TextField;