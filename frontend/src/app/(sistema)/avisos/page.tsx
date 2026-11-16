"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Aviso } from "@/app/types/avisos";
import { listarAvisos } from "@/app/services/avisoService";

import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import BudgetFiltros from "@/app/components/ui/BudgetFiltros";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import ItemsVazio from "@/app/components/ItemsVazio";

import CardAviso from "./components/CardAviso";

export default function AvisosPage() {
    const searchParams = useSearchParams();

    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalAvisos, setTotalAvisos] = useState(0);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [filtro, setFiltro] = useState(
        searchParams.get("ativo") === "false" ? "desativados" : (searchParams.get("ativo") === "todos" ? "todos" : "ativos")
    );

    useEffect(() => {
        carregarAvisos();
    }, [pagina, filtro]);

    async function carregarAvisos() {
        try {
            setCarregando(true);
            setErro("");

            const ativo = filtro === "todos" ? undefined : filtro === "ativos";
            const dados = await listarAvisos(pagina, ativo);

            setAvisos(dados.content);
            setTotalPaginas(dados.totalPages);
            setTotalAvisos(dados.totalElements);
        } catch (error) {

            setErro(error instanceof Error ? error.message : "Erro ao carregar os avisos!");
        } finally {
            setCarregando(false);
        }
    }

    function alterarFiltro(valor: string) {

        setPagina(0);
        setFiltro(valor);

    }

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">

                        <BotaoVoltarHistorico />

                        <div className="min-w-0">
                            <h1 className="text-2xl font-semibold">Avisos</h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {totalAvisos} avisos no total
                            </p>
                        </div>
                    </div>

                    <BotaoNovo href="/avisos/novo" texto="Novo aviso" />
                </div>
                <div className="mt-5">
                    <BudgetFiltros valor={filtro} onChange={alterarFiltro} 
                        opcoes={[
                            { valor: "ativos", label: "Ativos" },
                            { valor: "desativados", label: "Desativados" },
                            { valor: "todos", label: "Todos" },
                        ]}
                    />
                </div>
            </CabecalhoPagina>

            <section className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">

                {carregando ? (

                    <CarregandoConteudo mensagem="Carregando avisos..." />

                ) : erro ? (

                    <ErroCarregamento mensagem={erro} />

                ) : avisos.length ? (

                    avisos.map(aviso => (
                        <CardAviso key={aviso.id} aviso={aviso} exibirStatus/>
                    ))

                ) : (

                    <ItemsVazio titulo="Nenhum aviso encontrado." />

                )}

                {!carregando && !erro && totalPaginas > 1 && (
                    <div className="flex items-center justify-center gap-3 py-4">

                        <button type="button" disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}
                            className="rounded-xl border border-border bg-card px-4 py-2 text-sm enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
                        >
                            Anterior
                        </button>

                        <span className="text-sm text-muted-foreground">
                            Página {pagina + 1} de {totalPaginas}
                        </span>

                        <button type="button" disabled={pagina + 1 >= totalPaginas} onClick={() => setPagina(pagina + 1)}
                            className="rounded-xl border border-border bg-card px-4 py-2 text-sm enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
                        >
                            Próxima
                        </button>

                    </div>
                )}
            </section>
        </>
    );
}