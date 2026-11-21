"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";

import type { DocumentoLista } from "@/app/types/documentos";
import { listarDocumentos } from "@/app/services/documentoService";
import { formatarData, normalizeSearch } from "@/app/util";

import BarraPesquisa from "@/app/components/ui/BarraPesquisa";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BudgetFiltros from "@/app/components/ui/BudgetFiltros";
import BudgetStatus from "@/app/components/ui/BudgeStatus";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import Card from "@/app/components/ui/Card";
import ItemsVazio from "@/app/components/ItemsVazio";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import DocumentosRecentes from "../home/components/DocumentosRecentes";

export default function DocumentosPage() {

    const [documentos, setDocumentos] = useState<DocumentoLista[]>([]);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalDocumentos, setTotalDocumentos] = useState(0);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");   

    const [search, setSearch] = useState("");
    
    type FiltroDocumento = "todos" | "pendentes" | "finalizados";
    const [filtro, setFiltro] = useState<FiltroDocumento>("todos");

    const status = filtro === "pendentes" ? "PENDENTE" :
        filtro === "finalizados" ? "FINALIZADO" :
        undefined;

    useEffect(() => {
        carregarDocumentos();
    }, [pagina, filtro]);

    async function carregarDocumentos() {
        try {
            setCarregando(true);
            setErro("");

            const dados = await listarDocumentos(pagina, status);

            setDocumentos(dados.content);
            setTotalPaginas(dados.totalPages);
            setTotalDocumentos(dados.totalElements);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar documentos.");
        } finally {
            setCarregando(false);
        }
    }

    const documentosFiltrados = documentos.filter(documento => {
        const busca = normalizeSearch(search);
        return (
            normalizeSearch(documento.tipoDocumento).includes(busca) ||
            normalizeSearch(documento.paciente).includes(busca) ||
            normalizeSearch(documento.apelido || "").includes(busca) ||
            normalizeSearch(documento.criadoPor).includes(busca)
        );
    });

  return (
    <>
        <section className="border-b border-border bg-card">
            <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
                <div className="flex items-center justify-between gap-4">

                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold">Documentos</h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {totalDocumentos} documentos no total
                        </p>
                    </div>

                    <BotaoNovo href="/documentos/novo" texto="Novo documento" />

                </div>  

                <div className="mt-5">
                    <BarraPesquisa value={search} onChange={setSearch} placeholder="Buscar por paciente, tipo ou responsável..."/>

                    <div className="mt-3">
                        <BudgetFiltros
                            valor={filtro}
                            onChange={(valor) => {
                                setPagina(0);
                                setFiltro(valor as FiltroDocumento);
                            }}
                            opcoes={[
                                { valor: "todos", label: "Todos" },
                                { valor: "pendentes", label: "Pendentes" },
                                { valor: "finalizados", label: "Finalizados" },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </section>

        <DocumentosRecentes />

        <ProximosAniversariantes />

{/* 
        {totalPaginas > 1 && (

          <div className="flex items-center justify-center gap-3 py-4">

            <button
              type="button"
              disabled={pagina === 0}
              onClick={() => setPagina(pagina - 1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm
                enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm text-muted-foreground">
              Página {pagina + 1} de {totalPaginas}
            </span>

            <button
              type="button"
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm
                enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
            >
              Próxima
            </button>

          </div>

        )} */}

    </>
  );
}
