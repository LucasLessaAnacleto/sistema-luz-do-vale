"use client";

import { CheckCircle2, TriangleAlert, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

type Variante = "perigo" | "confirmacao";

interface Props {
    aberto: boolean;
    titulo: string;
    descricao: string;
    variante?: Variante;
    textoConfirmar?: string;
    disabledConfirmar?: boolean;
    carregando?: boolean;
    erro?: string;
    children?: ReactNode;
    onConfirmar: () => void | Promise<void>;
    onFechar: () => void;
}

export default function ModalConfirmacao({ 
    aberto, 
    titulo, 
    descricao, 
    variante = "confirmacao", 
    textoConfirmar = "Confirmar", 
    disabledConfirmar = false,
    carregando = false,
    erro,
    children,
    onConfirmar,
    onFechar
}: Props) {
    if (!aberto) return null;
    const perigo = variante === "perigo";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">{titulo}</h2>

                    <button type="button" onClick={onFechar} disabled={carregando}
                        className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-accent disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{descricao}</p>

                {children && (
                    <div className="mt-4">
                        {children}
                    </div>
                )}

                {erro && (
                    <p role="alert" className="mt-3 text-sm text-red-600">{erro}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onFechar} disabled={carregando}
                        className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button type="button" onClick={onConfirmar} disabled={carregando || disabledConfirmar}
                        className={twMerge(clsx("cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60",
                            perigo ? clsx("bg-red-700", !disabledConfirmar && "hover:bg-red-800") : clsx("bg-primary", !disabledConfirmar && "hover:bg-primary-dark")))
                        }
                    >
                        {carregando ? "Processando..." : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}