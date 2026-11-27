import type { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    tamanho?: "sm" | "md";
    children: ReactNode;
}

export default function Selecao({ label, tamanho = "md", children, className = "", ...props}: Props) {

    if (tamanho === "sm") {
        return (
            <div>

                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {label}
                </label>

                <div className="relative">

                    <select {...props} className={`h-9 w-full cursor-pointer appearance-none rounded-lg border border-border bg-input-background
                            pr-8 pl-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${className}
                        `}
                    >
                        {children}
                    </select>

                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                </div>

            </div>
        );
    }

    return (
        <div>

            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <select {...props} className={`min-h-11 w-full rounded-xl border border-border bg-input-background px-4
                    text-base text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${className}
                `}
            >
                {children}
            </select>

        </div>
    );
}