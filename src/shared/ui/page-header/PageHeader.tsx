import type { ReactNode } from "react";

type Props = {
    title: string;
    subTitle?: string;
    right?: ReactNode;
    actions?: ReactNode;
};

export default function PageHeader({ title, subTitle, right, actions }: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                {subTitle ? <p className="text-sm text-zinc-300">{subTitle}</p> : null}
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                {right ? <div className="w-full sm:w-80">{right}</div> : null}
                {actions ? <div className="w-full sm:w-auto">{actions}</div> : null}
            </div>
        </div>
    )
}