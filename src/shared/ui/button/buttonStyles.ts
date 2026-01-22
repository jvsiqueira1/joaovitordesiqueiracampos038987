type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

type ButtonStyleOptions = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function buttonClass({
  variant = "secondary",
  size = "md",
  fullWidth,
  className,
  disabled,
}: ButtonStyleOptions) {
  const base =
    "inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors disabled:opacity-60 disabled:pointer-events-none";

  const sizes: Record<Size, string> = {
    sm: "px-3 py-2",
    md: "px-4 py-2",
  };

  const variants: Record<Variant, string> = {
    primary: "bg-zinc-100 text-zinc-900 border-transparent hover:bg-white",
    secondary: "border-zinc-800 text-zinc-50 hover:border-zinc-700 bg-transparent",
    danger: "border-red-900/60 bg-red-950/30 text-red-200 hover:bg-red-950/40",
    ghost: "border-transparent text-zinc-300 hover:text-white hover:bg-zinc-900/40",
  };

  return cx(
    base,
    sizes[size],
    variants[variant],
    fullWidth && "w-full",
    disabled && "opacity-60",
    className,
  );
}

export type ButtonVariant = Variant;
export type ButtonSize = Size;
