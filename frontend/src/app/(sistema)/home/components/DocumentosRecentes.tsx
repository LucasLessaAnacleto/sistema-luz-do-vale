"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import type { DocumentoLista } from "@/app/types/documentos";
import { listarDocumentosRecentes } from "@/app/services/documentoService";
import { formatarData } from "@/app/util";

import BadgeStatus from "@/app/components/ui/BudgeStatus";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";

export default function DocumentosRecentes() {

    const [documentos, setDocumentos] = useState<DocumentoLista[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarDocumentos() {
        try {
            setCarregando(true);
            setErro("");

            const dados = await listarDocumentosRecentes();
            setDocumentos(dados);
        } catch (error) {
            setErro( error instanceof Error ? error.message : "Erro ao carregar documentos recentes.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarDocumentos();
    }, []);

    return (
        <section>
            <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
                <h2 className="text-base font-semibold sm:text-lg">
                    Últimos documentos criados
                </h2>

                <Link href="/documentos" className="text-xs font-medium text-primary-dark hover:underline sm:text-sm">
                    Ver todos
                </Link>
            </div>

            {carregando ? (
                <CarregandoConteudo mensagem="Carregando documentos..." />

            ) : erro ? (
                <ErroCarregamento mensagem={erro} onRetry={carregarDocumentos}/>

            ) : documentos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum documento recente encontrado.</p>

            ) : (
                <div className="space-y-3">

                    {documentos.map(documento => (
                        <Link key={documento.id} href={`/documentos/${documento.id}`}
                            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
                                <div className="min-w-0">

                                    <h3 className="text-sm leading-relaxed font-medium">
                                        {documento.tipoDocumento}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {documento.paciente}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatarData(documento.dtCriacao)}{" · "}{documento.criadoPor}
                                    </p>

                                    {documento.dtFinalizacao && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Finalizado em {formatarData(documento.dtFinalizacao)}
                                        </p>
                                    )}

                                </div>

                                <BadgeStatus 
                                    texto={documento.status === "FINALIZADO" ? "Finalizado" : "Pendente"}
                                    tipo={ documento.status === "FINALIZADO" ? "sucesso" : "alerta" }
                                />

                            </div>

                        </Link>

                    ))}

                </div>
            )}

        </section>
    );
}