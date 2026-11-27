import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    descricao?: string | null;
    icon?: ReactNode;
}

export default function Input({
    label,
    descricao,
    icon,
    id,
    className = "",
    type,
    ...props
}: InputProps) {
    const idGerado = useId();
    const inputId = id ?? idGerado;

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const isSenha = type === "password";

    const tipoInput = isSenha && mostrarSenha ? "text" : type;

    return (
        <div>
            <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-medium"
            >
                {label}
            </label>

            {descricao && (
                <p id={`${inputId}-descricao`} className="mb-2 text-sm text-muted-foreground">{descricao}</p>
            )}

            <div className="relative">
                {icon && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
                    >
                        {icon}
                    </span>
                )}

                <input
                    {...props}
                    id={inputId}
                    type={tipoInput}
                    className={`
                        w-full rounded-xl border border-border bg-input-background py-3
                        ${isSenha ? "pr-12" : "pr-4"}
                        ${icon ? "pl-12" : "pl-4"}
                        text-base text-foreground placeholder:text-muted-foreground
                        transition duration-200
                        focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none
                        disabled:opacity-60 motion-reduce:transition-none
                        ${className}
                    `}
                />

                {isSenha && (
                    <button
                        type="button"
                        onClick={() => setMostrarSenha((prev) => !prev)}
                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        aria-pressed={mostrarSenha}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                    >
                        {mostrarSenha ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}