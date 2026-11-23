"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
    aberto: boolean;
    ativo: boolean;
    nomePaciente: string;
    carregando: boolean;
    erro: string;
    onConfirmar: (motivo: string | null) => Promise<void>;
    onFechar: () => void;
}

export default function ModalStatusPaciente({
    aberto,
    ativo,
    nomePaciente,
    carregando,
    erro,
    onConfirmar,
    onFechar
}: Props) {

    const [motivo, setMotivo] = useState("");

    if (!aberto) return null;

    const acao = ativo ? "Desativar" : "Reativar";

    function fechar() {
        if (carregando) return;
        setMotivo("");
        onFechar();
    }

    async function confirmar() {
        await onConfirmar(motivo.trim() || null);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl">

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {acao} paciente
                    </h2>

                    <button type="button" onClick={fechar} disabled={carregando}
                        className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-accent disabled:opacity-50">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                    Deseja {acao.toLowerCase()} o paciente <strong>{nomePaciente}</strong>?
                    Essa ação ficará registrada no histórico.
                </p>

                <div className="mt-5">
                    <label htmlFor="motivo-status" className="mb-2 block text-sm font-medium">
                        Motivo (opcional)
                    </label>

                    <textarea id="motivo-status" rows={3} maxLength={500} placeholder="Informe o motivo da alteração..."
                        className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                        value={motivo}
                        disabled={carregando} 
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                </div>

                {erro && (
                    <p role="alert" className="mt-3 text-sm text-red-600">{erro}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={fechar} disabled={carregando}
                        className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50">
                        Cancelar
                    </button>

                    <button type="button" onClick={confirmar} disabled={carregando}
                        className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                            ativo ? "bg-red-700 hover:bg-red-800" : "bg-primary hover:bg-primary-dark"
                        }`}>
                        {carregando ? "Processando..." : acao}
                    </button>
                </div>
            </div>
        </div>
    );
}
