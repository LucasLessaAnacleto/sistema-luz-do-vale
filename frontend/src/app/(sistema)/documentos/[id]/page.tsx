"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import type { DocumentoDetalhes } from "@/app/types/documentos";
import type { PacienteDetalhes } from "@/app/types/pacientes";

import { buscarDocumento, buscarHtmlDocumento, buscarPdfDocumento } from "@/app/services/documentoService";
import { buscarPaciente } from "@/app/services/pacienteService";

import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import BadgeStatus from "@/app/components/ui/BudgeStatus";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import Card from "@/app/components/ui/Card";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";

export default function DocumentoDetalhesPage() {
    const params = useParams<{id: string}>();
    const { id } = params;

    const [documento, setDocumento] = useState<DocumentoDetalhes | null>(null);
    const [paciente, setPaciente] = useState<PacienteDetalhes | null>(null);
    const [html, setHtml] = useState("");
    const [baixando, setBaixando] = useState(false);

    useEffect(() => {
        carregarDocumento();
    }, [id]);

    async function carregarDocumento() {
        try {
            const dadosDocumento = await buscarDocumento(Number(id));
            setDocumento(dadosDocumento);
            const dadosPaciente = await buscarPaciente(dadosDocumento.pacienteId);
            setPaciente(dadosPaciente);
            const conteudoHtml = await buscarHtmlDocumento(Number(id));
            setHtml(conteudoHtml);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }

    async function baixarPdf() {
        try {
            setBaixando(true);

            const pdf = await buscarPdfDocumento(Number(id));
            const url = URL.createObjectURL(pdf);
            const link = document.createElement("a");

            link.href = url;
            link.download = `documento-${id}.pdf`;

            document.body.appendChild(link);

            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (error) {

            if (error instanceof Error) {
                alert(error.message);
            }

        } finally {
            setBaixando(false);
        }
    }


    if (!documento) {
        return (
            <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted-foreground sm:px-8">
                Carregando documento...
            </p>
        );
    }

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                        {/* <BotaoVoltar href={voltarHref} /> */}
                        <BotaoVoltarHistorico />

                        <div>

                            <h1 className="text-xl font-semibold">
                                {documento.tipoDocumento}
                            </h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Documento #{documento.id} · v{documento.versao}
                            </p>

                        </div>

                    </div>


                    <BadgeStatus
                        texto={documento.dtAssinatura ? "Assinado" : "Pendente"}
                        tipo={documento.dtAssinatura ? "sucesso" : "alerta"}
                    />

                </div>


                {paciente && (

                    <Link
                        href={`/pacientes/${paciente.id}`}
                        className="mt-4 flex items-center gap-2 rounded-xl bg-primary/15 px-3 py-2 transition-colors hover:bg-primary/20"
                    >

                        <AvatarIniciais nome={paciente.nome} tamanho="sm" />

                        <span className="text-sm">

                            {paciente.nome}

                            {paciente.apelido && (
                                <span className="text-muted-foreground">
                                    {" "}({paciente.apelido})
                                </span>
                            )}

                        </span>

                    </Link>

                )}

            </CabecalhoPagina>

            <section className="mx-auto max-w-6xl px-5 py-5 sm:px-8">

                <div className="mb-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={baixarPdf}
                        disabled={baixando}
                        className="flex min-h-10 items-center gap-2 rounded-full bg-primary/15 px-4 text-sm font-medium text-primary-dark transition-colors enabled:cursor-pointer enabled:hover:bg-primary/25 disabled:opacity-60"
                    >
                        <Download className="h-4 w-4" />

                        {baixando ? "Baixando..." : "Baixar PDF"}
                    </button>
                </div>

                {html ? (

                    <iframe
                        srcDoc={html}
                        title={documento.tipoDocumento}
                        className="h-[750px] w-full rounded-2xl border border-border bg-white"
                    />

                ) : (

                    <Card>

                        <p className="text-sm text-muted-foreground">
                            Carregando visualização do documento...
                        </p>

                    </Card>

                )}

            </section>

        </>
    );
}