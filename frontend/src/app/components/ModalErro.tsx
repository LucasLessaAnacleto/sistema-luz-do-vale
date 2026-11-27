"use client";

import { TriangleAlert, X } from "lucide-react";

interface Props {
    aberto: boolean;
    titulo?: string;
    mensagem?: string;
    onFechar: () => void;
}

export default function ModalErro({ aberto, titulo = "Não foi possível concluir", mensagem, onFechar }: Props) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div role="alertdialog" className="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl">
                <div className="flex justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <TriangleAlert className="h-5 w-5 text-red-700" />
                        {titulo}
                    </h2>

                    <button type="button" onClick={onFechar}
                        className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-accent"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mensagem}</p>

                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={onFechar}
                        className="cursor-pointer rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
}