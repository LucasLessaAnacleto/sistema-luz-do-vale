"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";

import type { HistoricoDocumento } from "@/app/types/documentos";
import { buscarHistoricoPaciente } from "@/app/services/pacienteService";
import { formatarData } from "@/app/util";

import Card from "@/app/components/ui/Card";
import ItemsVazio from "@/app/components/ItemsVazio";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BadgeStatus from "@/app/components/ui/BudgeStatus";

export default function HistoricoPacientePage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);

    const [historicos, setHistoricos] = useState<HistoricoDocumento[]>([]);
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {
        carregarHistorico();
    }, [id]);


    async function carregarHistorico() {

        try {

            const dados = await buscarHistoricoPaciente(Number(id));

            setHistoricos(dados);

        } catch (error) {

            if (error instanceof Error) {
                alert(error.message);
            }

        } finally {

            setCarregando(false);

        }
    }


    return (
        <>

            <div className="mb-4 flex items-center justify-between gap-3">

                <h2 className="text-lg font-semibold">Histórico do paciente</h2>
                <BotaoNovo href={`/documentos/novo?paciente=${id}`} texto="Novo documento" />

            </div>


            {carregando ? (

                <p className="text-sm text-muted-foreground">
                    Carregando histórico...
                </p>

            ) : historicos.length ? (

                <div className="space-y-3">

                    {historicos.map((historico) => (

                        historico.documentoId ? (

                            <Link key={historico.id} href={`/documentos/${historico.documentoId}?pacienteId=${id}`} className="block">

                                <Card className="flex items-start gap-3 transition-colors hover:border-primary/40">

                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <FileText className="h-5 w-5" />
                                    </span>

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-sm font-medium">{historico.tipoDocumento || "Documento"}</h3>

                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Documento #{historico.documentoId}
                                                </p>

                                            </div>

                                            <BadgeStatus texto={historico.acao} tipo="sucesso" />

                                        </div>


                                        {historico.observacao && (
                                            <p className="mt-3 text-sm">
                                                {historico.observacao}
                                            </p>
                                        )}


                                        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">

                                            <p>{historico.usuario}</p>

                                            <p>{formatarData(historico.dtCriacao)}</p>

                                        </div>
                                    </div>
                                </Card>
                            </Link>

                        ) : (

                            <Card key={historico.id}>

                                <p className="text-sm font-medium">
                                    {historico.acao}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatarData(historico.dtCriacao)}
                                </p>

                            </Card>

                        )
                    ))}
                </div>

            ) : (
                <ItemsVazio
                    titulo="Nenhum histórico encontrado"
                    descricao="As alterações e documentos do paciente serão exibidos aqui."
                    icon={FileText}
                />
            )}
        </>
    );
}