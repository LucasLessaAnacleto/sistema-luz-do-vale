"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Archive } from "lucide-react";

import type { Aviso } from "@/app/types/avisos";
import { buscarAviso, desativarAviso } from "@/app/services/avisoService";
import { useAppSelector } from "@/app/redux/hook";
import { formatarData } from "@/app/util";

import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import BadgeStatus from "@/app/components/ui/BudgeStatus";
import Card from "@/app/components/ui/Card";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";

export default function AvisoDetalhesPage() {
    const { id } = useParams<{ id: string }>();

    const usuario = useAppSelector(state => state.auth.usuario);

    const [aviso, setAviso] = useState<Aviso | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
    const [desativando, setDesativando] = useState(false);
    const [erroDesativacao, setErroDesativacao] = useState("");

    const podeDesativar = aviso?.ativo &&
        (
            usuario?.role === "ROLE_ADMIN" ||
            usuario?.id === aviso.criadoPorId
        );

    async function carregarAviso() {
        try {
            setCarregando(true);
            setErro("");

            const dados = await buscarAviso(Number(id));
            setAviso(dados);
        } catch (error) {
            setErro( error instanceof Error ? error.message : "Erro ao carregar aviso.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarAviso();
    }, [id]);

    async function desativacaoDoAviso() {
        if (!aviso || !podeDesativar) return;

        try {
            setDesativando(true);
            setErroDesativacao("");

            await desativarAviso(aviso.id);

            const atualizado = await buscarAviso(aviso.id);
            setAviso(atualizado);
            setConfirmarDesativacao(false);
        } catch (error) {
            setErroDesativacao( error instanceof Error ? error.message : "Erro ao desativar aviso.");
        } finally {
            setDesativando(false);
        }
    }

    return (
        <>
            <CabecalhoPagina largura="5xl">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BotaoVoltarHistorico />

                        <div>
                            <h1 className="text-2xl font-semibold">
                                Detalhes do aviso
                            </h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Visualização do comunicado
                            </p>
                        </div>
                    </div>

                    {aviso && (
                        <BadgeStatus
                            texto={aviso.ativo ? "Ativo" : "Desativado"}
                            tipo={aviso.ativo ? "sucesso" : "neutro"}
                        />
                    )}
                </div>
            </CabecalhoPagina>

            <section className="mx-auto max-w-5xl space-y-4 px-5 py-6 sm:px-8">

                {carregando ? (
                    <CarregandoConteudo mensagem="Carregando aviso..." />

                ) : erro ? (
                    <ErroCarregamento mensagem={erro} onRetry={carregarAviso}/>

                ) : aviso && (
                    <>
                        <Card className="space-y-5">
                            <div>
                                <h2 className="mb-3 text-base font-semibold">Comunicado</h2>

                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                    {aviso.mensagem}
                                </p>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="grid gap-4 text-sm sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Publicado por
                                        </p>
                                        <p className="mt-1">
                                            {aviso.criadoPor}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Data de publicação
                                        </p>
                                        <p className="mt-1">
                                            {formatarData(aviso.dtCriacao)}
                                        </p>
                                    </div>

                                    {aviso.dtFinalizacao && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Finalização programada
                                            </p>
                                            <p className="mt-1">
                                                {formatarData(aviso.dtFinalizacao)}
                                            </p>
                                        </div>
                                    )}

                                    {aviso.dtDesativado && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Desativado em
                                            </p>
                                            <p className="mt-1">
                                                {formatarData(aviso.dtDesativado)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {podeDesativar && (
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setConfirmarDesativacao(true)}
                                    className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-red-300 px-4 text-sm font-medium text-red-700 hover:bg-red-50"
                                >
                                    <Archive className="h-4 w-4" />
                                    Desativar aviso
                                </button>
                            </div>
                        )}

                        <ModalConfirmacao
                            aberto={confirmarDesativacao}
                            titulo="Desativar aviso?"
                            descricao="O aviso deixará de aparecer no quadro de avisos ativos, mas continuará disponível no histórico."
                            variante="perigo"
                            textoConfirmar="Desativar"
                            carregando={desativando}
                            erro={erroDesativacao}
                            onConfirmar={desativacaoDoAviso}
                            onFechar={() => {setConfirmarDesativacao(false); setErroDesativacao("");}}
                        />
                    </>
                )}
                
            </section>
        </>
    );
}