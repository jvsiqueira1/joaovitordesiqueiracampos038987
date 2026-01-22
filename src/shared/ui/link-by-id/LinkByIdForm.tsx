import Button from "../button/Button";
import TextField from "../text-field/TextField";

export default function LinkByIdForm({
    label,
    placeholder,
    value,
    onChange,
    disabled,
    onSubmit,
    buttonText = "Vincular",
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    onSubmit: () => void;
    buttonText?: string;
}) {
    return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-56">
                <TextField
                    label={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode="numeric"
                    disabled={disabled}
                />
            </div>

            <Button
                variant="primary"
                className="w-full sm:w-auto"
                disabled={disabled || value.trim().length === 0}
                onClick={onSubmit}
            >
                {buttonText}
            </Button>
        </div>
    );
}