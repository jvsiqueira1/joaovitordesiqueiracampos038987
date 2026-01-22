import type { ButtonHTMLAttributes } from "react";

import { buttonClass, type ButtonSize, type ButtonVariant } from "./buttonStyles";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
};

export default function Button({ variant, size, fullWidth, className, ...props }: ButtonProps) {
    return (
        <button
            className={buttonClass({
                variant,
                size,
                fullWidth,
                className,
                disabled: props.disabled,
            })}
            {...props}
        />
    )
}